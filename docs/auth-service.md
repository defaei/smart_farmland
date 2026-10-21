# Auth Service

The auth service manages user sign-in, JWTs, and the current user's profile. It
uses **gRPC**, not REST. The protobuf contract is
[`proto/auth/v1/auth.proto`](../proto/auth/v1/auth.proto), in package `auth.v1`.

## Important for web clients

The service listens for native gRPC on port `50051` by default. Browsers cannot
call this native gRPC endpoint directly, and this repository does not currently
provide a gRPC-Web proxy or a browser-facing HTTP API. The web app should call a
client-facing gateway or backend that adapts its API to these RPCs. No such
gateway routes are defined here yet, so coordinate the HTTP contract with that
service rather than assuming these RPCs are REST endpoints.

Do not put the JWT signing secret or database credentials in the web app. Do not
expose the service's insecure gRPC listener directly to the public internet.

## RPCs

All RPC and message names below are defined in `auth.v1`.

| RPC | Request | Result | Authentication |
| --- | --- | --- | --- |
| `Login` | `LoginRequest { username, password }` | `TokenResponse` | None |
| `RefreshToken` | `RefreshTokenRequest { refresh_token }` | `TokenResponse` | None |
| `Logout` | `LogoutRequest { refresh_token }` | Empty `LogoutResponse` | None |
| `GetMe` | Empty `GetMeRequest` | `User` | Access token in gRPC metadata |
| `VerifyToken` | `VerifyTokenRequest { access_token }` | `VerifyTokenResponse` | None; intended for backend services |
| `ChangePassword` | `ChangePasswordRequest { old_password, new_password }` | `ChangePasswordResponse { message }` | Admin access token in gRPC metadata |

### Token response

`TokenResponse` contains:

| Field | Meaning |
| --- | --- |
| `access_token` | Short-lived JWT for authenticated requests |
| `refresh_token` | Longer-lived JWT used to obtain a replacement token pair |
| `token_type` | `bearer` |
| `expires_in` | Access-token lifetime in seconds |

The configured defaults are 15 minutes for access tokens and 7 days for refresh
tokens. Refreshing rotates the refresh token: the old token is revoked and a new
pair is returned. Store tokens securely and do not log them.

### Authenticated requests

For `GetMe` and `ChangePassword`, send this gRPC metadata entry:

```text
authorization: Bearer <access_token>
```

`GetMe` returns a `User` with `id`, `username`, `role`, `is_active`,
`created_at`, and `updated_at`. The timestamps are protobuf
`google.protobuf.Timestamp` values. `ChangePassword` is currently restricted to
the `admin` role.

## Typical sign-in flow

1. Call `Login` with the user's username and password.
2. Keep both returned tokens in the web app's chosen secure storage. Use the
   access token for authenticated calls through the gateway.
3. When an access token expires, call `RefreshToken` with the refresh token and
   replace **both** stored tokens with the returned pair.
4. On sign-out, call `Logout` with the current refresh token and clear both
   tokens locally. Logout revokes the refresh token; access tokens remain
   usable until they expire.
5. Call `GetMe` through the gateway to load the signed-in user's profile.

`VerifyToken` is for trusted backend callers (for example, a gateway), not a
substitute for client-side authorization. It returns `valid: false` for invalid
or expired access tokens; otherwise it also returns `user_id`, `username`, and
`role`.

There is no user-registration RPC in the current contract. On first startup,
the service creates the initial admin account from `ADMIN_USERNAME` and
`ADMIN_PASSWORD`.

## Validation and errors

RPC failures use standard gRPC status codes:

| Status | Meaning |
| --- | --- |
| `UNAUTHENTICATED` | Invalid credentials, or an invalid/expired token |
| `PERMISSION_DENIED` | The caller does not have the required role |
| `INVALID_ARGUMENT` | Invalid request values, such as an invalid new password |
| `RESOURCE_EXHAUSTED` | Login or refresh rate limit exceeded |
| `INTERNAL` | Unexpected service error |

Login trims the username and rejects an empty username. Passwords must not
exceed 72 UTF-8 bytes. A new password must be at least 10 characters, include
uppercase and lowercase letters and a digit, and not exceed 72 UTF-8 bytes. An
incorrect current password or reusing the current password also returns
`INVALID_ARGUMENT`.

Default rate limits are 5 login attempts per minute and 20 per hour, and 10
refresh attempts per minute and 100 per hour, per client IP. A successful
`Logout` response does not prove that a supplied token was valid; invalid
refresh tokens are treated as already logged out.

## Running the service

The service requires Python dependencies from
[`apps/auth-service/requirements.txt`](../apps/auth-service/requirements.txt),
PostgreSQL, and these environment variables:

| Variable | Required | Default / behavior |
| --- | --- | --- |
| `SQLALCHEMY_DATABASE_URL` | Yes for a usable deployment | Database URL; the development fallback is defined in `settings.py` |
| `JWT_SECRET_KEY` | Yes | Must be set and at least 32 characters |
| `ADMIN_PASSWORD` | Required on first startup with an empty database | Password used to create the initial admin |
| `ADMIN_USERNAME` | No | `admin` |
| `GRPC_HOST` | No | `0.0.0.0` |
| `GRPC_PORT` | No | `50051` |
| `JWT_ALGORITHM` | No | `HS256` |
| `JWT_ISSUER` | No | `auth-service` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `15` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | No | `7` |
| `REDIS_URL` | No | If unset or unavailable, rate limits use in-memory storage |
| `LOGIN_RATE_LIMIT` | No | `5/minute;20/hour` |
| `REFRESH_RATE_LIMIT` | No | `10/minute;100/hour` |
| `GRPC_REFLECTION` | No | `false` |

From the repository root, install the service requirements, generate the
protobuf stubs, configure the environment above, then run:

```bash
pip install -r apps/auth-service/requirements.txt
bash apps/auth-service/scripts/gen_proto.sh
cd apps/auth-service
python main.py
```

At startup, the service creates the database tables and, if there are no users,
the initial admin account. Set a strong JWT secret and admin password through
your local environment or deployment secret manager; do not commit them.
`GRPC_REFLECTION=true` enables gRPC reflection for development tools.

The server also registers the standard gRPC health service.

# Auth service boundaries

The Auth service is the source of truth for user identity and token lifecycle. It exposes the `auth.v1.AuthService` gRPC contract, verifies passwords, creates and rotates JWT access/refresh tokens, tracks refresh-token revocation, and serves authenticated profile and password-change requests.

PostgreSQL stores user and refresh-token state. The API gateway adapts browser-facing HTTP requests to this gRPC contract; the Auth service does not expose a browser-facing HTTP API or own device credentials.

See the [Auth service guide](auth-service.md) for RPC details and the [integrated deployment](../../smart-farmland/README.md) for the local service topology.

# Auth Service

This repository owns user identity, password verification, and access/refresh token behavior. The service exposes a versioned gRPC API and persists users and refresh-token state in PostgreSQL.

## Run locally

For the complete platform, use the [Smart Farmland integration project](../smart-farmland/README.md). To run this service independently, configure PostgreSQL and the variables in `apps/auth-service/sample.env`, install the requirements, generate the auth protobuf stubs, and start the service:

```bash
pip install -r apps/auth-service/requirements.txt
bash apps/auth-service/scripts/gen_proto.sh
cd apps/auth-service
python main.py
```

Set a random `JWT_SECRET_KEY` of at least 32 characters and an initial `ADMIN_PASSWORD`. Never commit local environment files or credentials.

## Documentation

- [Auth RPC contract and configuration](docs/auth-service.md)
- [Auth ownership and service boundaries](docs/architecture.md)
- [Contributing](CONTRIBUTING.md)

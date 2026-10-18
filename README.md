# Smart Farmland

![Project status](https://img.shields.io/badge/status-in%20development-yellow)
![Versions](https://img.shields.io/badge/versions-not%20pinned-lightgrey)
![CI](https://img.shields.io/badge/CI-not%20configured-lightgrey)

Smart Farmland is a soil-monitoring platform for collecting sensor readings and making them available through backend services and a web dashboard.

> This repository is currently a scaffold. The applications and automated checks are not implemented yet.

## Planned Technology

- Web: Next.js, Tailwind CSS, Redux
- Backend: NestJS, REST, Socket.IO, gRPC, authentication service
- Device: ESP32 firmware
- Contracts: Protocol Buffers

Framework and runtime versions have not been selected or pinned yet. Update the badges and this section when the project dependencies are established.

## Project Structure

| Directory                 | Description                         |
| ------------------------- | ----------------------------------- |
| `apps/web/`               | Web dashboard                       |
| `apps/gateway/`           | API gateway                         |
| `apps/auth-service/`      | User authentication service         |
| `apps/telemetry-service/` | Sensor telemetry service            |
| `apps/bi-service/`        | Analytics and reporting service     |
| `proto/`                  | Protocol Buffer contracts           |
| `packages/`               | Shared code and configuration       |
| `firmware/node-soil/`     | ESP32 soil-monitor firmware         |
| `infra/`                  | Local and deployment infrastructure |
| `docs/`                   | Project documentation               |

## Getting Started

There is no runnable application or root-level development setup yet. Setup and run instructions will be added here as the applications are implemented.

## Development Roadmap

The planned implementation order is a dashboard using mock data, an authentication service, sensor ingestion through the API gateway into the telemetry service, BI analytics, and finally end-to-end integration. See the [project plan](docs/plan.md) for milestones.

## Documentation

- [Architecture](docs/architecture.md)
- [Project plan](docs/plan.md)
- [API documentation](docs/api.md)
- [Device protocol](docs/device-protocol.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow and current project setup status.

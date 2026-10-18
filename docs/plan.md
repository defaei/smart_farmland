# Project Plan

This is the proposed implementation order, not a commitment to dates. Each milestone should be reviewed against product requirements before implementation begins.

## 1. Build the Dashboard with Mock Data

- Build the initial web dashboard with representative local fixture data; do not block the first UI on backend services.
- Create the main farm, device, and sensor-reading views needed for the first release.
- Include loading, empty, error, and offline-like states so the UI can later transition to live data.
- Keep mock data and API access isolated so fixtures can be replaced by gateway responses.

**Complete when:** the core dashboard workflow is usable with mock data and the first-release requirements are agreed.

## 2. Add the Authentication Service

- Define user identity, registration, login, session/token, credential recovery, and authorization requirements.
- Implement `apps/auth-service/` and its documented interface.
- Connect the API gateway to the auth service and protect user-facing routes.
- Decide separately how sensor devices authenticate; do not assume user credentials are suitable for devices.
- Add focused tests for successful and rejected authentication and protected access.

**Complete when:** a user can authenticate and access an authorized gateway route, with the auth behavior documented.

## 3. Connect Sensors Through the Gateway to Telemetry

- Confirm the sensor hardware, measurements, device identity, provisioning, transport, and payload format.
- Define the device protocol and gateway-to-telemetry service contract before implementation.
- Route device readings through the API gateway to `apps/telemetry-service/`.
- Validate units, ranges, timestamps, device identity, retries, and duplicate submissions.
- Store raw readings with a documented retention and query strategy.

**Complete when:** a test sensor can submit a reading through the gateway and the reading can be retrieved from telemetry.

## 4. Add BI and Reporting

- Agree on the first analytics and report requirements.
- Implement `apps/bi-service/` to consume telemetry through an explicit service contract.
- Verify calculations against known sample data and document report semantics.

**Complete when:** BI can produce a documented, repeatable result from telemetry data.

## 5. Integrate the Full Platform

- Replace dashboard fixtures with authenticated gateway APIs for farms, devices, readings, and reports.
- Verify the gateway's interactions with auth, telemetry, and BI services.
- Add realtime updates only if required by the first release; define their contract and failure behavior.
- Test the complete user flow from sign-in through viewing live readings and analytics.

**Complete when:** the dashboard, auth, gateway, telemetry, and BI services work together in an end-to-end test environment.

## 6. Operations and Release

- Choose supported runtime and tool versions and document local prerequisites.
- Add local service orchestration and deployment configuration.
- Configure CI for the checks that exist and define a protected release path.
- Add monitoring, logging, backups, retention, and incident procedures appropriate to the deployment.

**Complete when:** a release can be deployed and operated with documented recovery procedures.

## Current Status

The repository currently contains directory and documentation scaffolding. Application code, build commands, tests, CI, and deployment configuration have not been implemented. The dashboard-first, mock-data approach and the auth, sensor-ingestion, BI, and integration milestones describe the intended order of work.

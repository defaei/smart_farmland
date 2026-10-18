# Contributing

Thanks for contributing to Smart Farmland. The repository is currently a scaffold, so development setup, build commands, and automated checks are not available yet.

## Before You Start

- Check the existing documentation and open issues to understand the current direction.
- For a significant feature or change to a contract, open an issue or discussion first so the design can be agreed on before implementation.
- Keep changes focused on one concern and update the relevant documentation when behavior or interfaces change.

## Making Changes

1. Create a branch from the current default branch with a descriptive name, such as `feature/auth-service` or `docs/device-format`.
2. Make the change in the app, package, firmware, or documentation area that owns it.
3. Add or update tests when the affected project has a test setup.
4. Run the checks documented by the affected project. Until project scripts are added, state clearly which checks could not be run.
5. Open a pull request describing the problem, the solution, and verification performed. Link related issues and call out any follow-up work.

## Pull Request Checklist

- [ ] The change has a clear scope and description.
- [ ] Relevant documentation is updated.
- [ ] Tests and checks were run, or unavailable checks are noted.
- [ ] No secrets, credentials, generated build output, or local environment files are included.

## Project Decisions

The authentication service is part of the planned system, but its identity provider, credential handling, token/session model, and authorization policy are not yet selected. Device transport, service contracts, dependency versions, and deployment workflow also remain under design. Please document proposals and unresolved tradeoffs rather than treating draft documentation as an implemented contract.

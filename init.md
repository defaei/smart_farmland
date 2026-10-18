# init.md: Scaffold the Smart Farmland repo

## Task for Copilot

Create the full repository structure below **in a single terminal command**, run from the repo root (the folder that will contain `apps/`, `proto/`, etc.).

Rules:

- Use **one chained command** (`&&`), not several separate commands.
- Do not create any extra files or folders beyond this list.
- **Do not create or scaffold any app.** The folders under `apps/` stay empty (only `.gitkeep`). Do not run `nest new`, `create-next-app`, `npm init` or any generator, and do not generate source code, `package.json` or config files inside `apps/`, `packages/` or `firmware/`.
- Do not install dependencies and do not run `git init`.
- Empty folders get a `.gitkeep` so Git tracks them.
- If the OS is Windows without Bash, translate the same command to PowerShell and still run it as a single command.
- After running, print the resulting tree and confirm it matches the structure below.

## Target structure

```
smart-farmland/
├── apps/
│   ├── web/                       # Next.js + Tailwind + Redux
│   ├── gateway/                   # NestJS API gateway (REST, Socket.io, gRPC clients)
│   ├── telemetry-service/         # stores and serves raw sensor readings
│   └── bi-service/                # analytics and report generation
├── proto/                         # shared .proto contracts
│   ├── telemetry/v1/telemetry.proto
│   └── bi/v1/bi.proto
├── packages/
│   ├── proto-gen/                 # generated TS types from proto
│   ├── config/                    # shared eslint / tsconfig
│   └── common/                    # shared DTOs and constants
├── firmware/
│   └── node-soil/                 # ESP32 firmware (not part of the JS workspace)
├── infra/
│   ├── docker/                    # docker-compose for local dev
│   └── k8s/                       # manifests or helm, later
├── docs/
│   ├── plan.md
│   ├── architecture.md
│   ├── api.md
│   ├── device-protocol.md
│   └── adr/
├── .github/
│   ├── workflows/ci.yml
│   └── CODEOWNERS
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## The command (Bash)

```bash
mkdir -p apps/{web,gateway,telemetry-service,bi-service} proto/{telemetry,bi}/v1 packages/{proto-gen,config,common} firmware/node-soil infra/{docker,k8s} docs/adr .github/workflows \
&& touch apps/{web,gateway,telemetry-service,bi-service}/.gitkeep packages/{proto-gen,config,common}/.gitkeep firmware/node-soil/.gitkeep infra/{docker,k8s}/.gitkeep docs/adr/.gitkeep \
&& touch proto/telemetry/v1/telemetry.proto proto/bi/v1/bi.proto docs/{plan,architecture,api,device-protocol}.md .github/workflows/ci.yml \
&& printf '# Smart Farmland\n\nSoil monitoring platform: ESP32 sensors -> gateway -> telemetry + BI services -> web dashboard.\n\nSee docs/architecture.md.\n' > README.md \
&& printf 'packages:\n  - "apps/*"\n  - "packages/*"\n' > pnpm-workspace.yaml \
&& printf '{\n  "name": "smart-farmland",\n  "private": true,\n  "scripts": {\n    "dev": "turbo run dev",\n    "build": "turbo run build",\n    "lint": "turbo run lint",\n    "test": "turbo run test"\n  },\n  "devDependencies": {\n    "turbo": "^2.0.0"\n  }\n}\n' > package.json \
&& printf '{\n  "$schema": "https://turbo.build/schema.json",\n  "tasks": {\n    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },\n    "dev": { "cache": false, "persistent": true },\n    "lint": {},\n    "test": {}\n  }\n}\n' > turbo.json \
&& printf 'node_modules/\ndist/\n.next/\n.turbo/\n.pio/\n.env\n.env.*\n!.env.example\n' > .gitignore \
&& printf '# Replace the handles below with real GitHub usernames\n/apps/gateway/ @LEAD_HANDLE\n/apps/web/ @LEAD_HANDLE\n/proto/ @LEAD_HANDLE\n/apps/bi-service/ @ALIREZA_HANDLE\n/apps/telemetry-service/ @LEAD_HANDLE\n/firmware/ @MOHAMMAD_HANDLE\n' > .github/CODEOWNERS
```

## After the folders exist (do not do this now)

Anything beyond creating the folders and files above will be requested separately. Do not start on it.

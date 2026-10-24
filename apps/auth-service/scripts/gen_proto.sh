#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p gen
python -m grpc_tools.protoc \
  -I ../../proto \
  --python_out=gen \
  --grpc_python_out=gen \
  ../../proto/auth/v1/auth.proto

echo "Generated stubs in apps/auth-service/gen"
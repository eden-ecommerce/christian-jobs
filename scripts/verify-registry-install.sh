#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "GITHUB_TOKEN required (read:packages)."
  exit 1
fi

rm -rf node_modules
pnpm install --frozen-lockfile
pnpm ts-check
echo "OK."

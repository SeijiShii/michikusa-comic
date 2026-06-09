#!/usr/bin/env bash
# ローカル開発 dev server 起動 (O36)
set -euo pipefail
exec npx vite --host 0.0.0.0 "$@"

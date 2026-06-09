#!/usr/bin/env bash
set -euo pipefail
echo "① prod env 同期"; bash scripts/sync-prod-env.sh
echo "② prebuilt build"; rm -rf .vercel/output; node scripts/vercel-build.mjs
echo "③ deploy (--prebuilt --prod)"; vercel deploy --prebuilt --prod

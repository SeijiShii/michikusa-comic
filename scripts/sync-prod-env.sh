#!/usr/bin/env bash
# .env.production.local を Vercel production env に冪等同期 (値はマスク表示)
set -euo pipefail
ENV_FILE=".env.production.local"
[ -f "$ENV_FILE" ] || { echo "❌ $ENV_FILE 不在。本番 live キーを配置してください"; exit 1; }
while IFS= read -r line; do
  case "$line" in ''|\#*) continue;; esac
  key="${line%%=*}"; val="${line#*=}"
  val="$(printf '%s' "$val" | sed -E 's/[[:space:]]+#.*$//')"
  [ -z "$key" ] && continue
  if [ -z "$val" ]; then vercel env rm "$key" production -y 2>/dev/null || true; continue; fi
  masked="…${val: -4}"
  vercel env rm "$key" production -y 2>/dev/null || true
  printf '%s' "$val" | vercel env add "$key" production >/dev/null
  echo "  ✓ $key = $masked"
done < "$ENV_FILE"
echo "✅ prod env 同期完了"

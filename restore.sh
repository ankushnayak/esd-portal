#!/usr/bin/env sh
set -eu

if [ $# -lt 1 ]; then
  echo "Usage: ./restore.sh path/to/backup.sql"
  exit 1
fi

echo "==> Restoring database from $1"
cat "$1" | docker compose exec -T postgres psql -U postgres -d expert_seva_diwas
echo "==> Restore complete"

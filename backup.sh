#!/usr/bin/env sh
set -eu

BACKUP_DIR=${1:-backups}
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
mkdir -p "$BACKUP_DIR"

echo "==> Creating database backup"
docker compose exec -T postgres pg_dump -U postgres expert_seva_diwas > "$BACKUP_DIR/db-$TIMESTAMP.sql"
echo "==> Backup saved to $BACKUP_DIR/db-$TIMESTAMP.sql"

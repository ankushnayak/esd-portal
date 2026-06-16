#!/usr/bin/env sh
set -eu

bootstrap=false

if [ "${1:-}" = "--bootstrap" ]; then
  bootstrap=true
fi

echo "==> Expert Seva Diwas deployment started"
git pull --ff-only || true

echo "==> Building application image"
docker compose build app

echo "==> Starting PostgreSQL"
docker compose up -d postgres

echo "==> Running database migrations"
docker compose run --rm --no-deps app npm run prisma:migrate

if [ "$bootstrap" = true ]; then
  echo "==> Bootstrapping baseline records"
  docker compose run --rm --no-deps app npm run prisma:seed
fi

echo "==> Starting application services"
docker compose up -d app proxy
sleep 10

if curl -fsS http://localhost/api/health >/dev/null 2>&1 || curl -fsS http://localhost:3000/api/health >/dev/null 2>&1; then
  echo "==> Deployment completed successfully"
else
  echo "==> Deployment finished, but health check failed"
  exit 1
fi

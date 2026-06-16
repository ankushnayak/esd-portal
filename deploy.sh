#!/usr/bin/env sh
set -eu

echo "==> Expert Seva Diwas deployment started"
git pull --ff-only || true
npm install
npm run prisma:generate
docker compose build
docker compose up -d postgres
docker compose run --rm app npm run prisma:migrate
docker compose run --rm app npm run prisma:seed
docker compose up -d
sleep 10

if curl -fsS http://localhost/api/health >/dev/null 2>&1 || curl -fsS http://localhost:3000/api/health >/dev/null 2>&1; then
  echo "==> Deployment completed successfully"
else
  echo "==> Deployment finished, but health check failed"
  exit 1
fi

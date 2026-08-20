#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
npm --prefix "$ROOT_DIR/backend" ci
npm --prefix "$ROOT_DIR/backend" run prisma:deploy
npm --prefix "$ROOT_DIR/backend" run build
npm --prefix "$ROOT_DIR/frontend" ci
npm --prefix "$ROOT_DIR/frontend" run build
pm2 restart attock-welfare-backend 2>/dev/null || pm2 start "$ROOT_DIR/backend/dist/index.js" --name attock-welfare-backend
pm2 restart attock-welfare-frontend 2>/dev/null || pm2 start npm --name attock-welfare-frontend --cwd "$ROOT_DIR/frontend" -- start
pm2 save

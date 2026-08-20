#!/usr/bin/env bash
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL must be set}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"
STAMP="$(date +%Y-%m-%d_%H-%M-%S)"

case "$DATABASE_URL" in
  mysql://*) mysqldump "$DATABASE_URL" | gzip > "$BACKUP_DIR/attock-welfare-$STAMP.sql.gz" ;;
  file:*) echo "SQLite backup is managed by copying the database file; use DATABASE_FILE."; cp "${DATABASE_FILE:-./prisma/dev.db}" "$BACKUP_DIR/attock-welfare-$STAMP.db" ;;
  *) echo "Unsupported DATABASE_URL format" >&2; exit 1 ;;
esac

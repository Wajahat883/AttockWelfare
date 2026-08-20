#!/usr/bin/env bash
set -euo pipefail
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CRON="0 2 * * * cd $PROJECT_DIR/backend && DATABASE_URL=\"\$DATABASE_URL\" BACKUP_DIR=\"$PROJECT_DIR/backups\" bash scripts/backup.sh"
(crontab -l 2>/dev/null | grep -v 'attock-welfare backup' || true; echo "# attock-welfare backup"; echo "$CRON") | crontab -
echo "Daily 02:00 backup scheduled. Ensure DATABASE_URL is exported for cron."

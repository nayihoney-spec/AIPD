#!/usr/bin/env sh
set -eu

command -v docker >/dev/null 2>&1 || { echo "Docker Desktop / Docker Engine is required."; exit 1; }

printf "Database [postgres/mysql] (default postgres): "
read DB_CHOICE
DB_CHOICE=${DB_CHOICE:-postgres}
case "$DB_CHOICE" in postgres|mysql) ;; *) echo "Choose postgres or mysql"; exit 1;; esac

printf "Initial Admin Email: "
read ADMIN_EMAIL
[ -n "$ADMIN_EMAIL" ] || { echo "Admin email is required."; exit 1; }

printf "Initial Admin Password (min 12 chars): "
stty -echo 2>/dev/null || true
read ADMIN_PASSWORD
stty echo 2>/dev/null || true
printf "\n"
[ "${#ADMIN_PASSWORD}" -ge 12 ] || { echo "Password must be at least 12 characters."; exit 1; }

randhex(){ docker run --rm node:24-alpine node -e "process.stdout.write(require('crypto').randomBytes($1).toString('hex'))"; }
randb64(){ docker run --rm node:24-alpine node -e "process.stdout.write(require('crypto').randomBytes($1).toString('base64'))"; }

DB_PASS="$(randhex 18)"
ROOT_PASS="$(randhex 20)"
ENC_KEY="$(randb64 32)"
CRON_SECRET="$(randhex 24)"

if [ "$DB_CHOICE" = "postgres" ]; then
  DB_URL="postgres://aves:$DB_PASS@db-postgres:5432/aves_assessment"
  PROFILE="postgres"
else
  DB_URL="mysql://aves:$DB_PASS@db-mysql:3306/aves_assessment"
  PROFILE="mysql"
fi

cat > .env <<EOF
NODE_ENV=production
APP_PORT=3000
PUBLIC_BASE_URL=http://localhost:3000
DB_DIALECT=$DB_CHOICE
COMPOSE_PROFILES=$PROFILE
POSTGRES_DB=aves_assessment
POSTGRES_USER=aves
POSTGRES_PASSWORD=$DB_PASS
MYSQL_DATABASE=aves_assessment
MYSQL_USER=aves
MYSQL_PASSWORD=$DB_PASS
MYSQL_ROOT_PASSWORD=$ROOT_PASS
DATABASE_URL=$DB_URL
APP_ENCRYPTION_KEY=$ENC_KEY
CRON_SECRET=$CRON_SECRET
SESSION_TTL_HOURS=12
BOOTSTRAP_ADMIN_EMAIL=$ADMIN_EMAIL
BOOTSTRAP_ADMIN_PASSWORD=$ADMIN_PASSWORD
ENABLE_LOCAL_NOTIFICATION_WORKER=true
EOF

docker compose --profile "$PROFILE" up -d --build
echo ""
echo "Aves Assessment installation started."
echo "URL: http://localhost:3000"
echo "Admin: $ADMIN_EMAIL"
echo "Change the bootstrap password after first login."

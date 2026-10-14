#!/usr/bin/env sh
set -eu
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Install Docker Desktop / Docker Engine first."
  exit 1
fi
if [ ! -f .env ]; then cp .env.example .env; fi
echo "Edit .env and set passwords, APP_ENCRYPTION_KEY, BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD."
echo "Then run: docker compose --profile postgres up -d --build"

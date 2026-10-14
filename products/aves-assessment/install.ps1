$ErrorActionPreference = "Stop"
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Error "Docker Desktop / Docker Engine is required."
}
if (-not (Test-Path ".env")) { Copy-Item ".env.example" ".env" }
Write-Host "Edit .env and set passwords, APP_ENCRYPTION_KEY, BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD."
Write-Host "Then run: docker compose --profile postgres up -d --build"

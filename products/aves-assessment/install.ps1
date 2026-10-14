$ErrorActionPreference = "Stop"
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { throw "Docker Desktop / Docker Engine is required." }

$dbChoice = Read-Host "Database [postgres/mysql] (default postgres)"
if ([string]::IsNullOrWhiteSpace($dbChoice)) { $dbChoice = "postgres" }
$dbChoice = $dbChoice.ToLower()
if ($dbChoice -ne "postgres" -and $dbChoice -ne "mysql") { throw "Choose postgres or mysql." }

$adminEmail = Read-Host "Initial Admin Email"
if ([string]::IsNullOrWhiteSpace($adminEmail)) { throw "Admin email is required." }
$secure = Read-Host "Initial Admin Password (min 12 chars)" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try { $adminPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
if ($adminPassword.Length -lt 12) { throw "Password must be at least 12 characters." }

function New-Hex([int]$bytes) {
  $b = New-Object byte[] $bytes
  [Security.Cryptography.RandomNumberGenerator]::Fill($b)
  return -join ($b | ForEach-Object { $_.ToString("x2") })
}
function New-B64([int]$bytes) {
  $b = New-Object byte[] $bytes
  [Security.Cryptography.RandomNumberGenerator]::Fill($b)
  return [Convert]::ToBase64String($b)
}
$dbPass = New-Hex 18
$rootPass = New-Hex 20
$encKey = New-B64 32
$cronSecret = New-Hex 24

if ($dbChoice -eq "postgres") {
  $profile = "postgres"
  $dbUrl = "postgres://aves:$dbPass@db-postgres:5432/aves_assessment"
} else {
  $profile = "mysql"
  $dbUrl = "mysql://aves:$dbPass@db-mysql:3306/aves_assessment"
}

@"
NODE_ENV=production
APP_PORT=3000
PUBLIC_BASE_URL=http://localhost:3000
DB_DIALECT=$dbChoice
COMPOSE_PROFILES=$profile
POSTGRES_DB=aves_assessment
POSTGRES_USER=aves
POSTGRES_PASSWORD=$dbPass
MYSQL_DATABASE=aves_assessment
MYSQL_USER=aves
MYSQL_PASSWORD=$dbPass
MYSQL_ROOT_PASSWORD=$rootPass
DATABASE_URL=$dbUrl
APP_ENCRYPTION_KEY=$encKey
CRON_SECRET=$cronSecret
SESSION_TTL_HOURS=12
BOOTSTRAP_ADMIN_EMAIL=$adminEmail
BOOTSTRAP_ADMIN_PASSWORD=$adminPassword
ENABLE_LOCAL_NOTIFICATION_WORKER=true
"@ | Set-Content -Encoding UTF8 .env

docker compose --profile $profile up -d --build
Write-Host ""
Write-Host "Aves Assessment installation started."
Write-Host "URL: http://localhost:3000"
Write-Host "Admin: $adminEmail"
Write-Host "Change the bootstrap password after first login."

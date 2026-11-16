# backend/verify.ps1
$ErrorActionPreference = "Stop"

Write-Host "`n[verify] Activating venv..." -ForegroundColor Cyan
& "$PSScriptRoot\venv\Scripts\Activate.ps1"

Write-Host "[verify] Preflight imports..." -ForegroundColor Cyan
python "$PSScriptRoot\preflight.py"

# Optional: find psql (PostgreSQL default)
Write-Host "[verify] Locating PostgreSQL bin (optional)..." -ForegroundColor Cyan
$pgCandidates = @(
  "C:\Program Files\PostgreSQL\17\bin",
  "C:\Program Files\PostgreSQL\16\bin",
  "C:\Program Files\PostgreSQL\15\bin"
)
$added = $false
foreach ($c in $pgCandidates) {
  if (Test-Path $c -PathType Container -ErrorAction SilentlyContinue) {
    if (-not ($env:PATH -split ";" | Where-Object { $_ -eq $c })) {
      $env:PATH = "$c;$env:PATH"
      Write-Host "[verify] Added to PATH: $c" -ForegroundColor Green
      $added = $true
      break
    }
  }
}

Write-Host "[verify] Checking DB connectivity..." -ForegroundColor Cyan
if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
  Write-Host "[verify] WARNING: psql not found in PATH; skipping DB ping." -ForegroundColor Yellow
} else {
  $host = if ($env:DB_HOST) { $env:DB_HOST } else { "localhost" }
  $port = if ($env:DB_PORT) { $env:DB_PORT } else { "5432" }
  $name = if ($env:DB_NAME) { $env:DB_NAME } else { "filaops" }
  $user = if ($env:DB_USER) { $env:DB_USER } else { "postgres" }
  $pass = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { "Admin" }
  $env:PGPASSWORD = $pass
  psql -h $host -p $port -U $user -d $name -c "SELECT 1" | Out-Null
  Write-Host "[verify] DB ping OK." -ForegroundColor Green
}

Write-Host "[verify] ENABLE_GOOGLE_DRIVE =" $env:ENABLE_GOOGLE_DRIVE -ForegroundColor Cyan

Write-Host "[verify] Starting Uvicorn on :8001 ..." -ForegroundColor Cyan
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001

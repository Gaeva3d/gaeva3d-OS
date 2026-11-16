# Update Materials Unit of Measure to Grams (G)
# 
# This PowerShell script helps you run the SQL update script
# to change all materials from KG (or other units) to G

param(
    [string]$DatabaseName = "filaops",
    [string]$DatabaseUser = "postgres",
    [string]$DatabaseHost = "localhost",
    [int]$DatabasePort = 5432
)

$ErrorActionPreference = "Stop"

Write-Host "=" -NoNewline
Write-Host ("=" * 79)
Write-Host "Update Materials Unit of Measure to Grams (G)"
Write-Host ("=" * 80)
Write-Host ""

# Get database password
$DatabasePassword = Read-Host "Enter database password (or press Enter if using Windows auth)" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($DatabasePassword)
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "⚠️  WARNING: This will update all materials to unit = 'G'"
Write-Host "⚠️  Make sure you have a backup before proceeding!"
Write-Host ""

$confirm = Read-Host "Continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Cancelled."
    exit
}

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "Error: psql not found. Please install PostgreSQL client tools or run the SQL script manually."
    Write-Host ""
    Write-Host "SQL script location: scripts\database\update_materials_uom_to_grams.sql"
    Write-Host ""
    Write-Host "You can run it using:"
    Write-Host "  psql -U $DatabaseUser -d $DatabaseName -f scripts\database\update_materials_uom_to_grams.sql"
    exit 1
}

# Build connection string
$env:PGPASSWORD = $PlainPassword
$sqlFile = Join-Path $PSScriptRoot "database\update_materials_uom_to_grams.sql"

Write-Host "Running SQL script..."
Write-Host ""

try {
    & psql -h $DatabaseHost -p $DatabasePort -U $DatabaseUser -d $DatabaseName -f $sqlFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host ("=" * 80)
        Write-Host "✅ Update Complete!"
        Write-Host ("=" * 80)
        Write-Host ""
        Write-Host "Next steps:"
        Write-Host "1. Restart your backend server"
        Write-Host "2. Verify materials now show 'G' as their unit"
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Error: SQL script failed with exit code $LASTEXITCODE"
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error: $_"
    exit 1
} finally {
    $env:PGPASSWORD = ""
}


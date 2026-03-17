param(
    [switch]$Reset,
    [switch]$Nuke
)

function Step($msg) {
    Write-Host ""
    Write-Host "===== $msg =====" -ForegroundColor Cyan
}

function Success($msg) {
    Write-Host "$msg" -ForegroundColor Green
}

function Error($msg) {
    Write-Host "$msg" -ForegroundColor Red
}

function Check-Command($cmd) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        Error "Command '$cmd' not found. Please install it and make sure it's in your PATH."
        exit 1
    }
}

# -------------------------
# Check required tools
# -------------------------

Step "Checking required tools"

Check-Command docker

Success "All required tools detected"

# -------------------------
# Populate database
# -------------------------

Step "Populating database"

docker exec -it borreze-brz-backend-dev-1 sh -c "npm run populate"

if ($LASTEXITCODE -ne 0) {
    Error "Database population failed"
    exit 1
}

Success "Database populated"

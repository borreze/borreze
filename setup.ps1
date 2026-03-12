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

Check-Command git
Check-Command node
Check-Command npm
Check-Command docker
Check-Command docker-compose

Success "All required tools detected"

# -------------------------
# Setup environment
# -------------------------

Step "Setting up environment file"

if (Test-Path ".env") {
    Remove-Item ".env" -Force
}

Copy-Item ".env.development" ".env"

Success ".env file ready"

# -------------------------
# Install frontend deps
# -------------------------

Step "Installing frontend dependencies"

Set-Location frontend
npm install

if ($LASTEXITCODE -ne 0) {
    Error "Frontend npm install failed"
    exit 1
}

Success "Frontend dependencies installed"

Set-Location ..

# -------------------------
# Install backend deps
# -------------------------

Step "Installing backend dependencies"

Set-Location backend
npm install

if ($LASTEXITCODE -ne 0) {
    Error "Backend npm install failed"
    exit 1
}

Success "Backend dependencies installed"

Set-Location ..

# -------------------------
# Docker reset
# -------------------------

if ($Reset) {
    Step "Resetting Docker containers"

    docker-compose --profile development down -v

    Success "Containers stopped"
}

# -------------------------
# Optional Docker Nuke
# -------------------------

if ($Nuke) {
    Step "NUKING Docker (containers/images/volumes)"

    docker stop $(docker ps -aq) 2>$null
    docker system prune -a --volumes -f
    docker builder prune -a -f

    Success "Docker fully cleaned"
}

# -------------------------
# Start Docker
# -------------------------

Step "Starting Docker development environment"

docker-compose --profile development up --build -d

if ($LASTEXITCODE -ne 0) {
    Error "Failed to start Docker environment"
    exit 1
}

Success "Docker environment running"

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

# -------------------------
# Done
# -------------------------

Write-Host ""
Write-Host "🎉 Borrèze project is ready!" -ForegroundColor Green
Write-Host ""
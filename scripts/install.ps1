#!/usr/bin/env pwsh
# RestMan installer script for Windows
# Usage: powershell -c "irm restman.sh/install.ps1 | iex"

$ErrorActionPreference = 'Stop'

# GitHub repository
$GITHUB_REPO = "cadamsdev/restman"
$INSTALL_DIR = "$env:USERPROFILE\.restman"
$BIN_DIR = "$INSTALL_DIR\bin"

# Logging functions
function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

# Detect architecture
function Get-Architecture {
    $arch = $env:PROCESSOR_ARCHITECTURE
    
    switch ($arch) {
        "AMD64" { return "x64" }
        "ARM64" { return "arm64" }
        default {
            Write-Error "Unsupported architecture: $arch"
            exit 1
        }
    }
}

# Get latest release version from GitHub
function Get-LatestVersion {
    try {
        $release = Invoke-RestMethod -Uri "https://api.github.com/repos/$GITHUB_REPO/releases/latest"
        return $release.tag_name
    }
    catch {
        Write-Error "Failed to fetch latest version: $_"
        exit 1
    }
}

# Download and extract binary
function Install-RestMan {
    Write-Info "Detecting platform..."
    $arch = Get-Architecture
    $platform = "windows-$arch"
    Write-Success "Platform: $platform"

    Write-Info "Fetching latest version..."
    $version = Get-LatestVersion
    Write-Success "Latest version: $version"

    # Construct download URL
    $archiveFile = "restman-$platform.zip"
    $archiveUrl = "https://github.com/$GITHUB_REPO/releases/download/$version/$archiveFile"

    Write-Info "Downloading RestMan from $archiveUrl..."

    # Create temp directory
    $tmpDir = New-Item -ItemType Directory -Path "$env:TEMP\restman-install-$(Get-Random)" -Force

    try {
        # Download archive
        $tmpArchive = Join-Path $tmpDir $archiveFile
        Invoke-WebRequest -Uri $archiveUrl -OutFile $tmpArchive -UseBasicParsing

        Write-Success "Downloaded RestMan"

        # Create install directory
        Write-Info "Installing to $BIN_DIR..."
        New-Item -ItemType Directory -Path $BIN_DIR -Force | Out-Null

        # Extract archive
        Expand-Archive -Path $tmpArchive -DestinationPath $tmpDir -Force

        # Move binary to install directory
        $exePath = Join-Path $BIN_DIR "restman.exe"
        Move-Item -Path (Join-Path $tmpDir "restman.exe") -Destination $exePath -Force

        Write-Success "Installed RestMan to $exePath"
    }
    finally {
        # Cleanup temp directory
        Remove-Item -Path $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Update PATH environment variable
function Update-Path {
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    
    if ($currentPath -notlike "*$BIN_DIR*") {
        Write-Info "Adding $BIN_DIR to PATH..."
        
        $newPath = "$BIN_DIR;$currentPath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        
        # Update current session PATH
        $env:Path = "$BIN_DIR;$env:Path"
        
        Write-Success "Updated PATH environment variable"
        Write-Warning "You may need to restart your terminal for PATH changes to take effect"
    }
    else {
        Write-Success "PATH already contains $BIN_DIR"
    }
}

# Main installation process
function Main {
    Write-Host "🚀 RestMan Installer" -ForegroundColor Magenta
    Write-Host ""

    Install-RestMan
    Update-Path

    Write-Host ""
    Write-Success "RestMan installed successfully!"
    Write-Host ""
    Write-Host "To get started, run:" -ForegroundColor Cyan
    Write-Host "  restman" -ForegroundColor Green
    Write-Host ""
    Write-Host "For help:" -ForegroundColor Cyan
    Write-Host "  restman --help" -ForegroundColor Green
    Write-Host ""
}

Main

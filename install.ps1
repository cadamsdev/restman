#!/usr/bin/env pwsh
# RestMan installer script for Windows
# Usage: powershell -c "irm restman.sh/install.ps1 | iex"

$ErrorActionPreference = 'Stop'

# Configuration
$Repo = "cadamsdev/restman"
$InstallDir = if ($env:RESTMAN_INSTALL) { $env:RESTMAN_INSTALL } else { "$HOME\.restman" }
$BinDir = "$InstallDir\bin"
$Executable = "$BinDir\restman.exe"

# Helper function for colored output
function Write-ColorOutput {
  param(
    [string]$Message,
    [string]$Color = "White"
  )
  
  $previousColor = $Host.UI.RawUI.ForegroundColor
  $Host.UI.RawUI.ForegroundColor = $Color
  Write-Output $Message
  $Host.UI.RawUI.ForegroundColor = $previousColor
}

# Detect architecture
function Get-Architecture {
  $arch = $env:PROCESSOR_ARCHITECTURE
  
  switch ($arch) {
    "AMD64" { return "x64" }
    "ARM64" { return "arm64" }
    default {
      Write-ColorOutput "Unsupported architecture: $arch" "Red"
      exit 1
    }
  }
}

# Get latest release version
function Get-LatestVersion {
  try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases/latest"
    return $response.tag_name
  }
  catch {
    Write-ColorOutput "Failed to get latest version: $_" "Red"
    exit 1
  }
}

# Download and install RestMan
function Install-RestMan {
  $arch = Get-Architecture
  $version = Get-LatestVersion
  $platform = "windows-$arch"
  
  Write-ColorOutput "Installing RestMan $version for $platform..." "Green"
  
  # Construct download URL
  $archiveName = "restman-$platform.zip"
  $downloadUrl = "https://github.com/$Repo/releases/download/$version/$archiveName"
  
  Write-Output "Downloading from: $downloadUrl"
  
  # Create directories
  New-Item -ItemType Directory -Force -Path $BinDir | Out-Null
  
  # Download to temp directory
  $tempDir = New-Item -ItemType Directory -Path (Join-Path $env:TEMP "restman-install-$(Get-Random)")
  $archivePath = Join-Path $tempDir $archiveName
  
  try {
    Invoke-WebRequest -Uri $downloadUrl -OutFile $archivePath -UseBasicParsing
    
    # Extract archive
    $extractDir = Join-Path $tempDir "extracted"
    Expand-Archive -Path $archivePath -DestinationPath $extractDir -Force
    
    # Find and move binary (look for restman.exe or restman)
    $extractedBinary = Get-ChildItem -Path $extractDir -Recurse -Filter "restman*" | Where-Object { 
      $_.Name -eq "restman.exe" -or $_.Name -eq "restman" 
    } | Select-Object -First 1
    
    if ($extractedBinary) {
      Copy-Item -Path $extractedBinary.FullName -Destination $Executable -Force
      Write-ColorOutput "✓ RestMan installed to $Executable" "Green"
    }
    else {
      Write-ColorOutput "Binary not found in archive" "Red"
      exit 1
    }
  }
  catch {
    Write-ColorOutput "Installation failed: $_" "Red"
    exit 1
  }
  finally {
    # Cleanup temp directory
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
  }
}

# Add to PATH
function Update-Path {
  # Check if already in PATH
  $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
  
  if ($currentPath -like "*$BinDir*") {
    Write-ColorOutput "✓ $BinDir is already in PATH" "Green"
    return
  }
  
  # Add to user PATH
  try {
    $newPath = "$currentPath;$BinDir"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    
    # Update current session PATH
    $env:Path = "$env:Path;$BinDir"
    
    Write-ColorOutput "✓ Added $BinDir to PATH" "Green"
    Write-ColorOutput "Note: You may need to restart your terminal for PATH changes to take effect" "Yellow"
  }
  catch {
    Write-ColorOutput "Failed to update PATH: $_" "Yellow"
    Write-ColorOutput "Please manually add $BinDir to your PATH" "Yellow"
  }
}

# Verify installation
function Test-Installation {
  try {
    $version = & $Executable --version 2>&1
    Write-ColorOutput "✓ RestMan is working: $version" "Green"
  }
  catch {
    Write-ColorOutput "Warning: Could not verify installation" "Yellow"
  }
}

# Main installation flow
function Main {
  Write-ColorOutput "RestMan Installer" "Green"
  Write-Output ""
  
  Install-RestMan
  Update-Path
  
  Write-Output ""
  Write-ColorOutput "Installation complete!" "Green"
  Write-Output ""
  Write-Output "To get started:"
  Write-Output "  1. Restart your terminal or run: refreshenv (if using chocolatey)"
  Write-Output "  2. Run: restman"
  Write-Output ""
  Write-Output "For more information, visit: https://github.com/$Repo"
}

Main

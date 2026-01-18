# RestMan Installation Guide

## Quick Install

### Linux & macOS

```bash
curl -fsSL https://restman.sh/install | bash
```

Or using the direct GitHub URL:

```bash
curl -fsSL https://raw.githubusercontent.com/cadamsdev/restman/main/scripts/install.sh | bash
```

### Windows

```powershell
powershell -c "irm restman.sh/install.ps1 | iex"
```

Or using the direct GitHub URL:

```powershell
powershell -c "irm https://raw.githubusercontent.com/cadamsdev/restman/main/scripts/install.ps1 | iex"
```

## What the Installer Does

The installer automatically:

1. **Detects your platform** - Identifies your OS (Linux/macOS/Windows) and architecture (x64/ARM64)
2. **Downloads the latest release** - Fetches the appropriate binary from GitHub releases
3. **Installs to a local directory** - Places the binary in `~/.restman/bin` (or `%USERPROFILE%\.restman\bin` on Windows)
4. **Updates your PATH** - Adds the installation directory to your shell configuration

## Manual Installation

If you prefer to install manually:

### 1. Download the Binary

Visit the [releases page](https://github.com/cadamsdev/restman/releases) and download the appropriate file:

| Platform | File |
|----------|------|
| Linux (Intel/AMD) | `restman-linux-x64.tar.gz` |
| Linux (ARM) | `restman-linux-arm64.tar.gz` |
| macOS (Intel) | `restman-darwin-x64.zip` |
| macOS (Apple Silicon) | `restman-darwin-arm64.zip` |
| Windows (Intel/AMD) | `restman-windows-x64.zip` |

### 2. Extract the Archive

**Linux/macOS:**
```bash
# For .tar.gz files
tar -xzf restman-*.tar.gz

# For .zip files
unzip restman-*.zip
```

**Windows:**
Right-click the `.zip` file and select "Extract All..."

### 3. Add to PATH

**Linux/macOS:**
```bash
mkdir -p ~/.restman/bin
mv restman ~/.restman/bin/
echo 'export PATH="$HOME/.restman/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

For zsh, replace `.bashrc` with `.zshrc`

**Windows:**
1. Move `restman.exe` to a permanent location (e.g., `C:\Users\YourName\.restman\bin\`)
2. Open "Environment Variables" in System Properties
3. Add the directory to your PATH

### 4. Verify Installation

```bash
restman --help
```

## Building from Source

If you want to build RestMan from source:

### Prerequisites
- [Bun](https://bun.sh) v1.0 or higher

### Steps

```bash
# Clone the repository
git clone https://github.com/cadamsdev/restman.git
cd restman

# Install dependencies
bun install

# Run directly (development)
bun run src/cli.ts

# Build a binary for your platform
bun run scripts/build-target.ts linux-x64

# The binary will be in dist/restman-linux-x64/
```

Available build targets:
- `linux-x64`
- `linux-arm64`
- `darwin-x64` (macOS Intel)
- `darwin-arm64` (macOS Apple Silicon)
- `windows-x64`

## Uninstalling

### Linux & macOS
```bash
# Remove the binary
rm -rf ~/.restman

# Remove PATH entry from your shell config
# Edit ~/.bashrc (or ~/.zshrc) and remove the line:
# export PATH="$HOME/.restman/bin:$PATH"
```

### Windows
```powershell
# Remove the directory
Remove-Item -Path $env:USERPROFILE\.restman -Recurse -Force

# Remove from PATH via System Properties > Environment Variables
```

## Troubleshooting

### "command not found: restman"

The installation directory is not in your PATH. Try:

**Linux/macOS:**
```bash
# Check if the binary exists
ls ~/.restman/bin/restman

# Manually add to current session
export PATH="$HOME/.restman/bin:$PATH"

# Verify
restman --help
```

**Windows:**
```powershell
# Check if the binary exists
Test-Path $env:USERPROFILE\.restman\bin\restman.exe

# Restart your terminal or computer for PATH changes to take effect
```

### Permission Denied (Linux/macOS)

The binary might not be executable:
```bash
chmod +x ~/.restman/bin/restman
```

### Installation Script Fails

Try using the direct GitHub URL instead of the short URL:

**Linux/macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/cadamsdev/restman/main/scripts/install.sh | bash
```

**Windows:**
```powershell
powershell -c "irm https://raw.githubusercontent.com/cadamsdev/restman/main/scripts/install.ps1 | iex"
```

## Updating

To update to the latest version, simply run the installer again. It will replace the existing binary with the latest release.

## Need Help?

- [Report an issue](https://github.com/cadamsdev/restman/issues)
- [View documentation](https://github.com/cadamsdev/restman/blob/main/README.md)

#!/usr/bin/env bash
# RestMan installer script for Linux and macOS
# Usage: curl -fsSL https://restman.sh/install | bash

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REPO="cadamsdev/restman"
INSTALL_DIR="${RESTMAN_INSTALL:-$HOME/.restman}"
BIN_DIR="$INSTALL_DIR/bin"
EXECUTABLE="$BIN_DIR/restman"

# Detect OS and architecture
detect_platform() {
  local os arch

  os=$(uname -s | tr '[:upper:]' '[:lower:]')
  arch=$(uname -m)

  case "$os" in
    linux*)
      os="linux"
      ;;
    darwin*)
      os="darwin"
      ;;
    *)
      echo -e "${RED}Unsupported OS: $os${NC}" >&2
      exit 1
      ;;
  esac

  case "$arch" in
    x86_64 | amd64)
      arch="x64"
      ;;
    aarch64 | arm64)
      arch="arm64"
      ;;
    *)
      echo -e "${RED}Unsupported architecture: $arch${NC}" >&2
      exit 1
      ;;
  esac

  echo "${os}-${arch}"
}

# Get the latest release version from GitHub
get_latest_version() {
  local version
  version=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
  
  if [ -z "$version" ]; then
    echo -e "${RED}Failed to get latest version${NC}" >&2
    exit 1
  fi
  
  echo "$version"
}

# Download and extract RestMan
install_restman() {
  local platform version download_url archive_name
  
  platform=$(detect_platform)
  version=$(get_latest_version)
  
  echo -e "${GREEN}Installing RestMan ${version} for ${platform}...${NC}"
  
  # Construct download URL
  archive_name="restman-${platform}"
  if [[ "$platform" == "linux-"* ]]; then
    archive_name="${archive_name}.tar.gz"
  else
    archive_name="${archive_name}.zip"
  fi
  
  download_url="https://github.com/$REPO/releases/download/${version}/${archive_name}"
  
  echo "Downloading from: $download_url"
  
  # Create directories
  mkdir -p "$BIN_DIR"
  
  # Download and extract
  local temp_dir
  temp_dir=$(mktemp -d)
  trap 'rm -rf "$temp_dir"' EXIT
  
  cd "$temp_dir"
  
  if ! curl -fL "$download_url" -o "$archive_name"; then
    echo -e "${RED}Failed to download RestMan${NC}" >&2
    exit 1
  fi
  
  # Extract based on format
  if [[ "$archive_name" == *.tar.gz ]]; then
    tar -xzf "$archive_name"
  else
    unzip -q "$archive_name"
  fi
  
  # Find and move binary to install directory
  # The archive contains a directory like restman-platform/restman
  local binary_path
  binary_path=$(find . -name "restman" -type f | head -n 1)
  
  if [ -n "$binary_path" ] && [ -f "$binary_path" ]; then
    mv "$binary_path" "$EXECUTABLE"
    chmod +x "$EXECUTABLE"
  else
    echo -e "${RED}Binary not found in archive${NC}" >&2
    exit 1
  fi
  
  # macOS specific: Remove quarantine attribute
  if [[ "$(uname -s)" == "Darwin" ]]; then
    echo -e "${YELLOW}Removing macOS quarantine attribute...${NC}"
    xattr -d com.apple.quarantine "$EXECUTABLE" 2>/dev/null || true
  fi
  
  echo -e "${GREEN}✓ RestMan installed to $EXECUTABLE${NC}"
}

# Add to PATH by updating shell profile
update_path() {
  local shell_profile
  
  # Detect shell and corresponding profile
  if [ -n "${BASH_VERSION:-}" ]; then
    if [ -f "$HOME/.bashrc" ]; then
      shell_profile="$HOME/.bashrc"
    else
      shell_profile="$HOME/.bash_profile"
    fi
  elif [ -n "${ZSH_VERSION:-}" ]; then
    shell_profile="$HOME/.zshrc"
  elif [ -n "${FISH_VERSION:-}" ]; then
    shell_profile="$HOME/.config/fish/config.fish"
  else
    shell_profile="$HOME/.profile"
  fi
  
  # Check if already in PATH
  if [[ ":$PATH:" == *":$BIN_DIR:"* ]]; then
    echo -e "${GREEN}✓ $BIN_DIR is already in PATH${NC}"
    return
  fi
  
  # Add to profile
  local export_line
  if [[ "$shell_profile" == *"fish"* ]]; then
    export_line="set -gx PATH \$PATH $BIN_DIR"
  else
    export_line="export PATH=\"\$PATH:$BIN_DIR\""
  fi
  
  if ! grep -q "$BIN_DIR" "$shell_profile" 2>/dev/null; then
    echo "" >> "$shell_profile"
    echo "# RestMan" >> "$shell_profile"
    echo "$export_line" >> "$shell_profile"
    echo -e "${GREEN}✓ Added $BIN_DIR to PATH in $shell_profile${NC}"
    echo -e "${YELLOW}Run 'source $shell_profile' or restart your terminal to use restman${NC}"
  else
    echo -e "${GREEN}✓ $BIN_DIR already configured in $shell_profile${NC}"
  fi
}

# Main installation flow
main() {
  echo -e "${GREEN}RestMan Installer${NC}"
  echo ""
  
  install_restman
  update_path
  
  echo ""
  echo -e "${GREEN}Installation complete!${NC}"
  echo ""
  echo "To get started:"
  echo "  1. Reload your shell or run: source ~/.bashrc (or ~/.zshrc)"
  echo "  2. Run: restman"
  echo ""
  echo "For more information, visit: https://github.com/$REPO"
}

main

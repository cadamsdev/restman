#!/usr/bin/env bash
# RestMan installer script for Linux and macOS
# Usage: curl -fsSL https://restman.sh/install | bash

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# GitHub repository
GITHUB_REPO="cadamsdev/restman"
INSTALL_DIR="$HOME/.restman"
BIN_DIR="$INSTALL_DIR/bin"

# Logging functions
log_info() {
  echo -e "${CYAN}ℹ${NC} $1"
}

log_success() {
  echo -e "${GREEN}✓${NC} $1"
}

log_error() {
  echo -e "${RED}✗${NC} $1" >&2
}

log_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# Detect OS and architecture
detect_platform() {
  local os arch

  # Detect OS
  case "$(uname -s)" in
    Darwin*)
      os="darwin"
      ;;
    Linux*)
      os="linux"
      ;;
    *)
      log_error "Unsupported operating system: $(uname -s)"
      exit 1
      ;;
  esac

  # Detect architecture
  case "$(uname -m)" in
    x86_64 | amd64)
      arch="x64"
      ;;
    aarch64 | arm64)
      arch="arm64"
      ;;
    *)
      log_error "Unsupported architecture: $(uname -m)"
      exit 1
      ;;
  esac

  echo "${os}-${arch}"
}

# Get latest release version from GitHub
get_latest_version() {
  local version
  version=$(curl -fsSL "https://api.github.com/repos/${GITHUB_REPO}/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
  
  if [ -z "$version" ]; then
    log_error "Failed to fetch latest version"
    exit 1
  fi
  
  echo "$version"
}

# Download and extract binary
install_restman() {
  local platform version archive_url archive_file

  log_info "Detecting platform..."
  platform=$(detect_platform)
  log_success "Platform: $platform"

  log_info "Fetching latest version..."
  version=$(get_latest_version)
  log_success "Latest version: $version"

  # Construct download URL
  if [[ "$platform" == linux-* ]]; then
    archive_file="restman-${platform}.tar.gz"
  else
    archive_file="restman-${platform}.zip"
  fi
  
  archive_url="https://github.com/${GITHUB_REPO}/releases/download/${version}/${archive_file}"

  log_info "Downloading RestMan from $archive_url..."
  
  # Create temp directory
  local tmp_dir
  tmp_dir=$(mktemp -d)
  trap "rm -rf $tmp_dir" EXIT

  # Download archive
  if ! curl -fsSL "$archive_url" -o "$tmp_dir/$archive_file"; then
    log_error "Failed to download RestMan"
    exit 1
  fi

  log_success "Downloaded RestMan"

  # Create install directory
  log_info "Installing to $BIN_DIR..."
  mkdir -p "$BIN_DIR"

  # Extract archive
  if [[ "$archive_file" == *.tar.gz ]]; then
    tar -xzf "$tmp_dir/$archive_file" -C "$tmp_dir"
  else
    unzip -q "$tmp_dir/$archive_file" -d "$tmp_dir"
  fi

  # Move binary to install directory
  mv "$tmp_dir/restman" "$BIN_DIR/restman"
  chmod +x "$BIN_DIR/restman"

  log_success "Installed RestMan to $BIN_DIR/restman"
}

# Update PATH in shell config
update_path() {
  local shell_config modified

  modified=false

  # Detect shell and config file
  if [ -n "${BASH_VERSION:-}" ]; then
    shell_config="$HOME/.bashrc"
  elif [ -n "${ZSH_VERSION:-}" ]; then
    shell_config="$HOME/.zshrc"
  elif [ -f "$HOME/.profile" ]; then
    shell_config="$HOME/.profile"
  else
    shell_config="$HOME/.bashrc"
  fi

  # Check if PATH already contains restman bin
  if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    log_info "Adding $BIN_DIR to PATH in $shell_config..."
    
    echo "" >> "$shell_config"
    echo "# RestMan" >> "$shell_config"
    echo "export PATH=\"\$HOME/.restman/bin:\$PATH\"" >> "$shell_config"
    
    log_success "Updated $shell_config"
    modified=true
  else
    log_success "PATH already contains $BIN_DIR"
  fi

  # Also update fish config if fish is installed
  if command -v fish &> /dev/null; then
    local fish_config="$HOME/.config/fish/config.fish"
    mkdir -p "$(dirname "$fish_config")"
    
    if [ -f "$fish_config" ] && ! grep -q "restman/bin" "$fish_config"; then
      log_info "Adding $BIN_DIR to PATH in $fish_config..."
      echo "" >> "$fish_config"
      echo "# RestMan" >> "$fish_config"
      echo "set -gx PATH \$HOME/.restman/bin \$PATH" >> "$fish_config"
      log_success "Updated $fish_config"
      modified=true
    fi
  fi

  if [ "$modified" = true ]; then
    log_warning "Please restart your shell or run: source $shell_config"
  fi
}

# Main installation process
main() {
  echo -e "${MAGENTA}🚀 RestMan Installer${NC}"
  echo ""

  install_restman
  update_path

  echo ""
  log_success "RestMan installed successfully!"
  echo ""
  echo -e "${CYAN}To get started, run:${NC}"
  echo -e "  ${GREEN}restman${NC}"
  echo ""
  echo -e "${CYAN}For help:${NC}"
  echo -e "  ${GREEN}restman --help${NC}"
  echo ""
}

main

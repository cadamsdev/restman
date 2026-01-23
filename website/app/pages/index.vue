<template>
  <div>
    <!-- Navigation -->
    <nav class="nav">
      <div class="container">
        <div class="nav-content">
          <div class="nav-brand">
            <span class="brand-icon">🚀</span>
            <span class="brand-text gradient-text">RestMan</span>
          </div>
          <div class="nav-links">
            <a href="#features" class="nav-link">Features</a>
            <a href="#install" class="nav-link">Install</a>
            <a href="#screenshots" class="nav-link">Screenshots</a>
            <a href="#quickstart" class="nav-link">Quick Start</a>
            <a href="https://github.com/cadamsdev/restman" target="_blank" class="nav-link">
              <Icon name="mdi:github" size="20" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="gradient-text">REST API Client</span>
              <br />
              for Your Terminal
            </h1>
            <p class="hero-subtitle">
              A simple and easy to use REST API Client that runs in your terminal. Open-source
              alternative to Postman.
            </p>
            <div class="hero-buttons">
              <a href="#install" class="btn-primary">Get Started</a>
              <a href="https://github.com/cadamsdev/restman" target="_blank" class="btn-secondary">
                <Icon name="mdi:github" size="20" style="vertical-align: middle" />
                View on GitHub
              </a>
            </div>
            <div class="hero-features">
              <div class="hero-feature">
                <Icon name="mdi:lightning-bolt" size="24" />
                <span>Lightning Fast</span>
              </div>
              <div class="hero-feature">
                <Icon name="mdi:keyboard" size="24" />
                <span>Keyboard Driven</span>
              </div>
              <div class="hero-feature">
                <Icon name="mdi:open-source-initiative" size="24" />
                <span>Open Source</span>
              </div>
            </div>
          </div>
          <div class="hero-demo">
            <TerminalDemo />
          </div>
        </div>
      </div>
    </section>

    <!-- Installation Section -->
    <section id="install" class="install">
      <div class="container">
        <h2 class="section-title">
          <span class="gradient-text">Get Started in Seconds</span>
        </h2>
        <p class="section-subtitle">One command to install RestMan on your system</p>
        
        <!-- Installation Tabs -->
        <div class="install-tabs">
          <div class="tabs-header">
            <button
              :class="['tab-button', { active: activeTab === 'unix' }]"
              @click="activeTab = 'unix'"
            >
              <Icon name="mdi:linux" size="20" />
              Linux & Mac
            </button>
            <button
              :class="['tab-button', { active: activeTab === 'windows' }]"
              @click="activeTab = 'windows'"
            >
              <Icon name="mdi:microsoft-windows" size="20" />
              Windows
            </button>
          </div>
          <div class="tabs-content">
            <div v-show="activeTab === 'unix'" class="tab-panel">
              <div class="install-commands">
                <div class="command-group">
                  <p class="command-label">Quick Install</p>
                  <div class="code-block">
                    <pre><code>curl -fsSL https://raw.githubusercontent.com/cadamsdev/restman/main/install.sh | bash</code></pre>
                    <button class="copy-btn" @click="copyToClipboard('curl -fsSL https://raw.githubusercontent.com/cadamsdev/restman/main/install.sh | bash')">
                      <Icon name="mdi:content-copy" size="18" />
                    </button>
                  </div>
                </div>
                <div class="command-group">
                  <p class="command-label">Then run</p>
                  <div class="code-block">
                    <pre><code>restman</code></pre>
                    <button class="copy-btn" @click="copyToClipboard('restman')">
                      <Icon name="mdi:content-copy" size="18" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="activeTab === 'windows'" class="tab-panel">
              <div class="install-commands">
                <div class="command-group">
                  <p class="command-label">Quick Install (PowerShell)</p>
                  <div class="code-block">
                    <pre><code>irm https://raw.githubusercontent.com/cadamsdev/restman/main/install.ps1 | iex</code></pre>
                    <button class="copy-btn" @click="copyToClipboard('irm https://raw.githubusercontent.com/cadamsdev/restman/main/install.ps1 | iex')">
                      <Icon name="mdi:content-copy" size="18" />
                    </button>
                  </div>
                </div>
                <div class="command-group">
                  <p class="command-label">Then run</p>
                  <div class="code-block">
                    <pre><code>restman</code></pre>
                    <button class="copy-btn" @click="copyToClipboard('restman')">
                      <Icon name="mdi:content-copy" size="18" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="install-note">
          <p>
            For manual installation or other options, visit the 
            <a href="https://github.com/cadamsdev/restman#installation" target="_blank">GitHub repository</a>.
          </p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="container">
        <h2 class="section-title">
          <span class="gradient-text">Powerful Features</span>
        </h2>
        <p class="section-subtitle">
          Everything you need to test and debug REST APIs, right in your terminal
        </p>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="mdi:rocket-launch" size="48" />
            </div>
            <h3>Fast & Lightweight</h3>
            <p>
              Built with Bun for blazing fast performance. No bloated Electron wrapper - just pure
              terminal goodness.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="mdi:keyboard-variant" size="48" />
            </div>
            <h3>Keyboard-First</h3>
            <p>
              Navigate entirely with keyboard shortcuts. No mouse required. Perfect for terminal
              power users.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="mdi:cloud-sync" size="48" />
            </div>
            <h3>Environment Variables</h3>
            <p>
              Manage multiple environments (dev, staging, prod) with variable substitution like
              <code class="inline-code" v-pre>{{ API_KEY }}</code
              >.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="mdi:history" size="48" />
            </div>
            <h3>Request History</h3>
            <p>
              Automatically saves your request history. Browse, search, and replay previous requests
              instantly.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="mdi:content-save" size="48" />
            </div>
            <h3>Save & Reuse</h3>
            <p>
              Save frequently-used requests and organize them into collections for quick access.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="mdi:code-json" size="48" />
            </div>
            <h3>Smart Formatting</h3>
            <p>Automatic JSON pretty-printing, syntax highlighting, and response timing metrics.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Screenshots Section -->
    <section id="screenshots" class="screenshots">
      <div class="container">
        <h2 class="section-title">
          <span class="gradient-text">See It In Action</span>
        </h2>
        <p class="section-subtitle">A glimpse into RestMan's powerful interface</p>
        <div class="screenshots-grid">
          <div class="screenshot-card">
            <img src="/images/preview.png" alt="RestMan Preview" class="screenshot-img" />
            <div class="screenshot-caption">
              <h4>Main Interface</h4>
              <p>Clean, focused interface for making API requests</p>
            </div>
          </div>
          <div class="screenshot-card">
            <img src="/images/change_method.png" alt="Change HTTP Method" class="screenshot-img" />
            <div class="screenshot-caption">
              <h4>HTTP Method Selection</h4>
              <p>Quick method selector with keyboard shortcuts</p>
            </div>
          </div>
          <div class="screenshot-card">
            <img
              src="/images/view_response_body.png"
              alt="View Response Body"
              class="screenshot-img"
            />
            <div class="screenshot-caption">
              <h4>Full Response View</h4>
              <p>Expanded view for large JSON responses</p>
            </div>
          </div>
          <div class="screenshot-card">
            <img src="/images/history.png" alt="Request History" class="screenshot-img" />
            <div class="screenshot-caption">
              <h4>Request History</h4>
              <p>Browse and replay previous API requests</p>
            </div>
          </div>
          <div class="screenshot-card">
            <img src="/images/save_request.png" alt="Save Request" class="screenshot-img" />
            <div class="screenshot-caption">
              <h4>Save Requests</h4>
              <p>Save and organize frequently-used requests</p>
            </div>
          </div>
          <div class="screenshot-card">
            <img src="/images/environments.png" alt="Environments" class="screenshot-img" />
            <div class="screenshot-caption">
              <h4>Environment Management</h4>
              <p>Switch between dev, staging, and production</p>
            </div>
          </div>
          <div class="screenshot-card">
            <img src="/images/edit_env.png" alt="Edit Environment" class="screenshot-img" />
            <div class="screenshot-caption">
              <h4>Environment Variables</h4>
              <p>Manage environment-specific variables</p>
            </div>
          </div>
          <div class="screenshot-card">
            <img src="/images/help.png" alt="Help Modal" class="screenshot-img" />
            <div class="screenshot-caption">
              <h4>Built-in Help</h4>
              <p>Quick reference for all keyboard shortcuts</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Start Section -->
    <section id="quickstart" class="quickstart">
      <div class="container">
        <h2 class="section-title">
          <span class="gradient-text">Quick Start Guide</span>
        </h2>
        <p class="section-subtitle">Master RestMan in minutes with these essential features</p>
        <div class="quickstart-grid">
          <div class="quickstart-card">
            <h3>
              <Icon name="mdi:keyboard" size="28" />
              Keyboard Shortcuts
            </h3>
            <div class="shortcuts-list">
              <div class="shortcut">
                <kbd>Enter</kbd>
                <span>Send request</span>
              </div>
              <div class="shortcut">
                <kbd>e</kbd>
                <span>Edit focused field</span>
              </div>
              <div class="shortcut">
                <kbd>Tab</kbd>
                <span>Navigate fields</span>
              </div>
              <div class="shortcut">
                <kbd>h</kbd>
                <span>View history</span>
              </div>
              <div class="shortcut">
                <kbd>s</kbd>
                <span>Save request</span>
              </div>
              <div class="shortcut">
                <kbd>l</kbd>
                <span>Load saved request</span>
              </div>
              <div class="shortcut">
                <kbd>v</kbd>
                <span>Manage environments</span>
              </div>
              <div class="shortcut">
                <kbd>/</kbd>
                <span>Show help</span>
              </div>
            </div>
          </div>
          <div class="quickstart-card">
            <h3>
              <Icon name="mdi:cog" size="28" />
              Environment Variables
            </h3>
            <p>Use variables for dynamic values:</p>
            <div class="code-block" v-pre>
              <pre><code>https://{{BASE_URL}}/api/users
Authorization: Bearer {{TOKEN}}</code></pre>
            </div>
            <p>Create environments for different stages:</p>
            <ul class="feature-list">
              <li>Development: <code class="inline-code">localhost:3000</code></li>
              <li>Staging: <code class="inline-code">staging.api.com</code></li>
              <li>Production: <code class="inline-code">api.example.com</code></li>
            </ul>
            <p class="step-note">
              Press <kbd>v</kbd> to manage environments and switch between them instantly.
            </p>
          </div>
          <div class="quickstart-card">
            <h3>
              <Icon name="mdi:content-save" size="28" />
              Save & Reuse Requests
            </h3>
            <p>Save frequently-used requests:</p>
            <ol class="numbered-list">
              <li>Configure your request (URL, headers, body)</li>
              <li>Press <kbd>s</kbd> to save</li>
              <li>Give it a memorable name</li>
              <li>Press <kbd>l</kbd> to load saved requests anytime</li>
            </ol>
            <p class="step-note">
              Perfect for testing the same endpoints repeatedly during development.
            </p>
          </div>
          <div class="quickstart-card">
            <h3>
              <Icon name="mdi:history" size="28" />
              Request History
            </h3>
            <p>All your requests are automatically saved:</p>
            <ul class="feature-list">
              <li>Browse previous requests with <kbd>h</kbd></li>
              <li>See status codes and response times</li>
              <li>Replay any request instantly</li>
              <li>Last 100 requests stored locally</li>
            </ul>
            <p class="step-note">
              History is stored in <code class="inline-code">~/.restman/history.json</code>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <span class="brand-icon">🚀</span>
            <span class="brand-text gradient-text">RestMan</span>
            <p class="footer-tagline">REST API Client for Your Terminal</p>
          </div>
          <div class="footer-links">
            <div class="footer-column">
              <h4>Resources</h4>
              <a href="https://github.com/cadamsdev/restman" target="_blank">GitHub</a>
              <a
                href="https://github.com/cadamsdev/restman/blob/main/docs/KEYBOARD_SHORTCUTS.md"
                target="_blank"
                >Keyboard Shortcuts</a
              >
              <a
                href="https://github.com/cadamsdev/restman/blob/main/docs/ENVIRONMENT_VARIABLES.md"
                target="_blank"
                >Environment Docs</a
              >
            </div>
            <div class="footer-column">
              <h4>Community</h4>
              <a href="https://github.com/cadamsdev/restman/issues" target="_blank">Issues</a>
              <a href="https://github.com/cadamsdev/restman/discussions" target="_blank"
                >Discussions</a
              >
              <a href="https://github.com/sponsors/cadamsdev" target="_blank">Sponsor</a>
            </div>
            <div class="footer-column">
              <h4>Legal</h4>
              <a href="https://github.com/cadamsdev/restman/blob/main/LICENSE" target="_blank"
                >MIT License</a
              >
              <a href="https://github.com/cadamsdev/restman" target="_blank">Source Code</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>
            &copy; 2026 RestMan. Built with ❤️ by
            <a href="https://github.com/cadamsdev" target="_blank">cadamsdev</a>
          </p>
          <p class="footer-note">Powered by Bun, React, and OpenTUI</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref('unix')

const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Could add a toast notification here
        console.log('Copied to clipboard:', text);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  }
};
</script>

<style scoped>
/* Button Styles */
.btn-primary {
  background: var(--gradient-primary);
  color: var(--color-text-active);
  padding: 0.875rem var(--spacing-lg);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  display: inline-block;
  transition: all var(--transition-base);
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary-sm);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-active);
  padding: 0.875rem var(--spacing-lg);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  display: inline-block;
  transition: all var(--transition-base);
  border: 1px solid var(--color-border-lighter);
  cursor: pointer;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Feature Card Styles */
.feature-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
  transition: all var(--transition-base);
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: var(--opacity-primary-50);
  box-shadow: var(--shadow-default);
}

/* Navigation */
.nav {
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-bg-nav);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.brand-icon {
  font-size: 1.75rem;
}

.brand-text {
  font-weight: var(--font-weight-bold);
}

.nav-links {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
}

.nav-link {
  color: var(--color-text-default);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-base);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.nav-link:hover {
  color: var(--color-primary);
}

/* Hero Section */
.hero {
  padding: var(--spacing-3xl) 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
}

.hero-title {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-md);
  font-weight: var(--font-weight-extrabold);
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-loose);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-lg);
}

.hero-buttons {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.hero-features {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.hero-feature {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

/* Installation Section */
.install {
  padding: var(--spacing-3xl) 0;
  background: var(--color-bg-overlay);
}

.install-tabs {
  max-width: 900px;
  margin: 0 auto;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-bg-overlay);
}

.tab-button {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: var(--color-text-default);
  background: rgba(255, 255, 255, 0.05);
}

.tab-button.active {
  color: var(--color-primary);
  background: var(--color-bg-card);
  border-bottom-color: var(--color-primary);
}

.tabs-content {
  padding: var(--spacing-lg);
}

.tab-panel {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.install-commands {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.command-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.command-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
  font-weight: var(--font-weight-medium);
}

.install-note {
  max-width: 900px;
  margin: var(--spacing-lg) auto 0;
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.install-note a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
}

.install-note a:hover {
  text-decoration: underline;
}

/* Shared Code Block Styles */
.code-block {
  background: var(--color-bg-dark);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  margin: var(--spacing-sm) 0;
  position: relative;
  border: 1px solid var(--color-border-default);
}

.code-block pre {
  margin: 0;
  overflow-x: auto;
}

.code-block code {
  color: var(--color-code-output);
  font-size: var(--font-size-base);
}

.copy-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--color-border-lighter);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs);
  color: var(--color-text-default);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.inline-code {
  background: var(--opacity-primary-20);
  padding: 0.2rem var(--spacing-xs);
  border-radius: var(--radius-sm);
  color: var(--color-primary);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  border: 1px solid var(--opacity-primary-30);
}

/* Features Section */
.features {
  padding: var(--spacing-3xl) 0;
  background: var(--color-bg-overlay);
}

.section-title {
  font-size: var(--font-size-3xl);
  text-align: center;
  margin-bottom: var(--spacing-sm);
  font-weight: var(--font-weight-bold);
}

.section-subtitle {
  text-align: center;
  font-size: var(--font-size-md);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-2xl);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

.feature-icon {
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.feature-card h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-active);
}

.feature-card p {
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
}

/* Screenshots Section */
.screenshots {
  padding: var(--spacing-3xl) 0;
  background: var(--color-bg-overlay);
}

.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-lg);
}

.screenshot-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--transition-base);
  cursor: pointer;
}

.screenshot-card:hover {
  transform: translateY(-5px);
  border-color: var(--opacity-primary-50);
  box-shadow: var(--shadow-primary-md);
}

.screenshot-img {
  width: 100%;
  height: auto;
  display: block;
  border-bottom: 1px solid var(--color-border-light);
}

.screenshot-caption {
  padding: var(--spacing-md);
}

.screenshot-caption h4 {
  font-size: var(--font-size-lg);
  color: var(--color-text-active);
  margin-bottom: var(--spacing-xs);
  font-weight: var(--font-weight-semibold);
}

.screenshot-caption p {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-base);
}

/* Quick Start Section */
.quickstart {
  padding: var(--spacing-3xl) 0;
  background: var(--color-bg-overlay);
}

.quickstart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.quickstart-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
}

.quickstart-card h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-active);
}

.quickstart-card h3 svg {
  color: var(--color-primary);
}

.quickstart-card p {
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-sm);
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shortcut {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.shortcut kbd {
  background: var(--color-bg-dark);
  padding: 0.4rem 0.8rem;
  border-radius: 0.35rem;
  border: 1px solid var(--color-border-default);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  min-width: 3rem;
  text-align: center;
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.shortcut span {
  color: var(--color-text-muted);
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: var(--spacing-sm) 0;
}

.feature-list li {
  color: var(--color-text-muted);
  padding-left: var(--spacing-md);
  position: relative;
  margin-bottom: var(--spacing-xs);
}

.feature-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

.numbered-list {
  padding-left: var(--spacing-md);
  color: var(--color-text-muted);
  margin: var(--spacing-sm) 0;
}

.numbered-list li {
  margin-bottom: var(--spacing-xs);
  line-height: var(--line-height-relaxed);
}

/* Footer */
.footer {
  padding: var(--spacing-2xl) 0 var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
  background: var(--color-bg-nav);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-xl);
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.footer-brand .brand-icon {
  font-size: 2rem;
}

.footer-brand .brand-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.footer-tagline {
  color: var(--color-text-muted);
  margin-top: var(--spacing-xs);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}

.footer-column h4 {
  color: var(--color-text-active);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-md);
}

.footer-column a {
  display: block;
  color: var(--color-text-muted);
  text-decoration: none;
  margin-bottom: 0.75rem;
  transition: color var(--transition-base);
}

.footer-column a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
  color: var(--color-text-placeholder);
}

.footer-bottom a {
  color: var(--color-primary);
  text-decoration: none;
}

.footer-bottom a:hover {
  text-decoration: underline;
}

.footer-note {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-placeholder);
}

/* Responsive Design */
@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }

  .hero-title {
    font-size: var(--font-size-3xl);
  }

  .screenshots-grid {
    grid-template-columns: 1fr;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .nav-links {
    gap: var(--spacing-sm);
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 640px) {
  .hero {
    padding: var(--spacing-2xl) 0;
  }

  .hero-title {
    font-size: var(--font-size-2xl);
  }

  .hero-subtitle {
    font-size: var(--font-size-base);
  }

  .hero-buttons {
    flex-direction: column;
  }

  .section-title {
    font-size: var(--font-size-2xl);
  }

  .install-step {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .footer-links {
    grid-template-columns: 1fr;
  }

  .nav-links {
    display: none; /* Hide nav links on mobile, could add hamburger menu */
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.75rem var(--spacing-md);
    font-size: var(--font-size-xs);
  }
}
</style>

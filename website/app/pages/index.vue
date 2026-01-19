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
              A powerful Terminal User Interface (TUI) REST API client built with Bun. 
              Think Postman for the terminal - fast, keyboard-driven, and built for 
              developers who live in the command line.
            </p>
            <div class="hero-buttons">
              <a href="#install" class="btn-primary">Get Started</a>
              <a href="https://github.com/cadamsdev/restman" target="_blank" class="btn-secondary">
                <Icon name="mdi:github" size="20" style="vertical-align: middle;" />
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
            <p>Built with Bun for blazing fast performance. No bloated Electron wrapper - just pure terminal goodness.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="mdi:keyboard-variant" size="48" />
            </div>
            <h3>Keyboard-First</h3>
            <p>Navigate entirely with keyboard shortcuts. No mouse required. Perfect for terminal power users.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="mdi:cloud-sync" size="48" />
            </div>
            <h3>Environment Variables</h3>
            <p>Manage multiple environments (dev, staging, prod) with variable substitution like <code class="inline-code" v-pre>{{API_KEY}}</code>.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="mdi:history" size="48" />
            </div>
            <h3>Request History</h3>
            <p>Automatically saves your request history. Browse, search, and replay previous requests instantly.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Icon name="mdi:content-save" size="48" />
            </div>
            <h3>Save & Reuse</h3>
            <p>Save frequently-used requests and organize them into collections for quick access.</p>
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

    <!-- Installation Section -->
    <section id="install" class="install">
      <div class="container">
        <h2 class="section-title">
          <span class="gradient-text">Get Started in Seconds</span>
        </h2>
        <p class="section-subtitle">
          Installation is quick and easy with Bun or npm
        </p>
        <div class="install-steps">
          <div class="install-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Install with Bun (Recommended)</h3>
              <div class="code-block">
                <pre><code>bun install -g restman</code></pre>
                <button class="copy-btn" @click="copyToClipboard('bun install -g restman')">
                  <Icon name="mdi:content-copy" size="18" />
                </button>
              </div>
              <p class="step-note">Or use npm:</p>
              <div class="code-block">
                <pre><code>npm install -g restman</code></pre>
                <button class="copy-btn" @click="copyToClipboard('npm install -g restman')">
                  <Icon name="mdi:content-copy" size="18" />
                </button>
              </div>
            </div>
          </div>
          <div class="install-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Run RestMan</h3>
              <div class="code-block">
                <pre><code>restman</code></pre>
                <button class="copy-btn" @click="copyToClipboard('restman')">
                  <Icon name="mdi:content-copy" size="18" />
                </button>
              </div>
              <p class="step-note">That's it! You're ready to make API requests.</p>
            </div>
          </div>
          <div class="install-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Start Testing APIs</h3>
              <p>Enter a URL, configure headers, and press <code class="inline-code">Enter</code> to send your first request.</p>
              <p class="step-note">Press <code class="inline-code">/</code> for help with all keyboard shortcuts.</p>
            </div>
          </div>
        </div>
        <div class="pro-tip">
          <Icon name="mdi:lightbulb-on" size="24" />
          <div>
            <strong>Pro Tip:</strong> Run <code class="inline-code">restman --help</code> to see all available options and flags.
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
        <p class="section-subtitle">
          Master RestMan in minutes with these essential features
        </p>
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
            <p class="step-note">Press <kbd>v</kbd> to manage environments and switch between them instantly.</p>
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
            <p class="step-note">Perfect for testing the same endpoints repeatedly during development.</p>
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
            <p class="step-note">History is stored in <code class="inline-code">~/.restman/history.json</code></p>
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
              <a href="https://github.com/cadamsdev/restman/blob/main/docs/KEYBOARD_SHORTCUTS.md" target="_blank">Keyboard Shortcuts</a>
              <a href="https://github.com/cadamsdev/restman/blob/main/docs/ENVIRONMENT_VARIABLES.md" target="_blank">Environment Docs</a>
            </div>
            <div class="footer-column">
              <h4>Community</h4>
              <a href="https://github.com/cadamsdev/restman/issues" target="_blank">Issues</a>
              <a href="https://github.com/cadamsdev/restman/discussions" target="_blank">Discussions</a>
              <a href="https://github.com/sponsors/cadamsdev" target="_blank">Sponsor</a>
            </div>
            <div class="footer-column">
              <h4>Legal</h4>
              <a href="https://github.com/cadamsdev/restman/blob/main/LICENSE" target="_blank">MIT License</a>
              <a href="https://github.com/cadamsdev/restman" target="_blank">Source Code</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 RestMan. Built with ❤️ by <a href="https://github.com/cadamsdev" target="_blank">cadamsdev</a></p>
          <p class="footer-note">Powered by Bun, React, and Ink</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Could add a toast notification here
        console.log('Copied to clipboard:', text)
      })
      .catch(err => {
        console.error('Failed to copy:', err)
      })
  }
}
</script>

<style scoped>
/* Navigation */
.nav {
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
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
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.brand-icon {
  font-size: 1.75rem;
}

.brand-text {
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: #e0e0e0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link:hover {
  color: #667eea;
}

/* Hero Section */
.hero {
  padding: 6rem 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  font-weight: 800;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.8;
  color: #b0b0b0;
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.hero-features {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.hero-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  font-weight: 500;
}

/* Features Section */
.features {
  padding: 6rem 0;
  background: rgba(0, 0, 0, 0.2);
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 700;
}

.section-subtitle {
  text-align: center;
  font-size: 1.125rem;
  color: #b0b0b0;
  margin-bottom: 4rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.feature-icon {
  color: #667eea;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
}

.feature-card p {
  color: #b0b0b0;
  line-height: 1.6;
}

/* Installation Section */
.install {
  padding: 6rem 0;
}

.install-steps {
  max-width: 800px;
  margin: 0 auto;
}

.install-step {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
}

.step-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
}

.code-block {
  background: #1e1e2e;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.code-block pre {
  margin: 0;
  overflow-x: auto;
}

.code-block code {
  color: #8be9fd;
  font-size: 1rem;
}

.copy-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.25rem;
  padding: 0.5rem;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.step-note {
  color: #b0b0b0;
  margin-top: 0.5rem;
  font-size: 0.95rem;
}

.inline-code {
  background: rgba(102, 126, 234, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  color: #8be9fd;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
}

.pro-tip {
  max-width: 800px;
  margin: 3rem auto 0;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.pro-tip > svg {
  color: #f1fa8c;
  flex-shrink: 0;
}

/* Quick Start Section */
.quickstart {
  padding: 6rem 0;
  background: rgba(0, 0, 0, 0.2);
}

.quickstart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.quickstart-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.quickstart-card h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #fff;
}

.quickstart-card h3 svg {
  color: #667eea;
}

.quickstart-card p {
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shortcut {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.shortcut kbd {
  background: #1e1e2e;
  padding: 0.4rem 0.8rem;
  border-radius: 0.35rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  min-width: 3rem;
  text-align: center;
  color: #8be9fd;
}

.shortcut span {
  color: #b0b0b0;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.feature-list li {
  color: #b0b0b0;
  padding-left: 1.5rem;
  position: relative;
  margin-bottom: 0.5rem;
}

.feature-list li::before {
  content: "→";
  position: absolute;
  left: 0;
  color: #667eea;
}

.numbered-list {
  padding-left: 1.5rem;
  color: #b0b0b0;
  margin: 1rem 0;
}

.numbered-list li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

/* Footer */
.footer {
  padding: 4rem 0 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-brand .brand-icon {
  font-size: 2rem;
}

.footer-brand .brand-text {
  font-size: 1.5rem;
  font-weight: 700;
}

.footer-tagline {
  color: #b0b0b0;
  margin-top: 0.5rem;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-column h4 {
  color: #fff;
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.footer-column a {
  display: block;
  color: #b0b0b0;
  text-decoration: none;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
}

.footer-column a:hover {
  color: #667eea;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #80808;
}

.footer-bottom a {
  color: #667eea;
  text-decoration: none;
}

.footer-bottom a:hover {
  text-decoration: underline;
}

.footer-note {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #808080;
}

/* Responsive Design */
@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .nav-links {
    gap: 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 4rem 0;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .section-title {
    font-size: 2rem;
  }

  .install-step {
    flex-direction: column;
    gap: 1rem;
  }

  .footer-links {
    grid-template-columns: 1fr;
  }

  .nav-links {
    display: none; /* Hide nav links on mobile, could add hamburger menu */
  }
}
</style>

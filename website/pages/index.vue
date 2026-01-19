<template>
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <nav class="nav container">
        <div class="logo">
          <Icon name="mdi:rocket-launch" size="32" />
          <span>RestMan</span>
        </div>
        <div class="nav-links">
          <a href="#features">Features</a>
          <a href="#install">Install</a>
          <a href="#docs">Docs</a>
          <a href="https://github.com/cadamsdev/restman" target="_blank" class="github-link">
            <Icon name="mdi:github" size="24" />
          </a>
        </div>
      </nav>

      <div class="hero-content container">
        <div class="hero-text">
          <h1>REST API Testing<br />Right in Your <span class="gradient-text">Terminal</span></h1>
          <p class="hero-description">
            RestMan is a powerful Terminal User Interface (TUI) REST API client built with Bun. 
            Think Postman, but for developers who live in the terminal.
          </p>
          <div class="hero-buttons">
            <a href="#install" class="btn-primary">
              <Icon name="mdi:download" size="20" />
              Get Started
            </a>
            <a href="https://github.com/cadamsdev/restman" target="_blank" class="btn-secondary">
              <Icon name="mdi:github" size="20" />
              View on GitHub
            </a>
          </div>
        </div>
        <div class="hero-terminal">
          <TerminalDemo />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="container">
        <h2 class="section-title">Why <span class="gradient-text">RestMan</span>?</h2>
        <p class="section-subtitle">Everything you need for API testing, without leaving your terminal</p>
        
        <div class="features-grid">
          <div class="feature-card">
            <Icon name="mdi:lightning-bolt" size="48" class="feature-icon" />
            <h3>Blazing Fast</h3>
            <p>Built with Bun for incredible performance. No GUI overhead, just pure speed.</p>
          </div>

          <div class="feature-card">
            <Icon name="mdi:keyboard" size="48" class="feature-icon" />
            <h3>Keyboard-First</h3>
            <p>Navigate everything with keyboard shortcuts. Keep your hands on the keyboard.</p>
          </div>

          <div class="feature-card">
            <Icon name="mdi:history" size="48" class="feature-icon" />
            <h3>Request History</h3>
            <p>Automatically saves your requests. Never lose your API testing progress.</p>
          </div>

          <div class="feature-card">
            <Icon name="mdi:content-save" size="48" class="feature-icon" />
            <h3>Save & Load</h3>
            <p>Save requests for later. Build your own library of API calls.</p>
          </div>

          <div class="feature-card">
            <Icon name="mdi:variable" size="48" class="feature-icon" />
            <h3>Environment Variables</h3>
            <p>Switch between dev, staging, and prod with ease. Variable substitution built-in.</p>
          </div>

          <div class="feature-card">
            <Icon name="mdi:code-json" size="48" class="feature-icon" />
            <h3>Smart Formatting</h3>
            <p>Auto-formats JSON responses. Syntax highlighting for better readability.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Installation Section -->
    <section id="install" class="install">
      <div class="container">
        <h2 class="section-title">Get <span class="gradient-text">Started</span></h2>
        <p class="section-subtitle">Install RestMan in seconds with Bun</p>
        
        <div class="install-steps">
          <div class="install-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Install Bun (if you haven't already)</h3>
              <div class="code-block">
                <div class="code-header">
                  <span>bash</span>
                  <button @click="copyToClipboard('curl -fsSL https://bun.sh/install | bash')" class="copy-btn">
                    <Icon :name="copied === 1 ? 'mdi:check' : 'mdi:content-copy'" size="18" />
                  </button>
                </div>
                <pre><code>curl -fsSL https://bun.sh/install | bash</code></pre>
              </div>
            </div>
          </div>

          <div class="install-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Clone the RestMan repository</h3>
              <div class="code-block">
                <div class="code-header">
                  <span>bash</span>
                  <button @click="copyToClipboard('git clone https://github.com/cadamsdev/restman.git\ncd restman')" class="copy-btn">
                    <Icon :name="copied === 2 ? 'mdi:check' : 'mdi:content-copy'" size="18" />
                  </button>
                </div>
                <pre><code>git clone https://github.com/cadamsdev/restman.git
cd restman</code></pre>
              </div>
            </div>
          </div>

          <div class="install-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Install dependencies and run</h3>
              <div class="code-block">
                <div class="code-header">
                  <span>bash</span>
                  <button @click="copyToClipboard('bun install\nbun run index.ts')" class="copy-btn">
                    <Icon :name="copied === 3 ? 'mdi:check' : 'mdi:content-copy'" size="18" />
                  </button>
                </div>
                <pre><code>bun install
bun run index.ts</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div class="install-note">
          <Icon name="mdi:information" size="24" />
          <p>You can also make it executable and add to your PATH for quick access: <code>chmod +x index.ts && ln -s $(pwd)/index.ts /usr/local/bin/restman</code></p>
        </div>
      </div>
    </section>

    <!-- Quick Start Section -->
    <section id="docs" class="quickstart">
      <div class="container">
        <h2 class="section-title">Quick <span class="gradient-text">Start</span></h2>
        <p class="section-subtitle">Get productive in minutes</p>
        
        <div class="quickstart-grid">
          <div class="quickstart-card">
            <h3>
              <Icon name="mdi:keyboard-outline" size="28" />
              Keyboard Shortcuts
            </h3>
            <ul class="shortcuts-list">
              <li><kbd>Enter</kbd> Send request</li>
              <li><kbd>e</kbd> Edit mode</li>
              <li><kbd>Tab</kbd> Navigate fields</li>
              <li><kbd>h</kbd> View history</li>
              <li><kbd>s</kbd> Save request</li>
              <li><kbd>l</kbd> Load saved</li>
              <li><kbd>v</kbd> Environments</li>
              <li><kbd>/</kbd> Help</li>
            </ul>
          </div>

          <div class="quickstart-card">
            <h3>
              <Icon name="mdi:variable" size="28" />
              Environment Variables
            </h3>
            <p class="card-description">Use variables in your requests:</p>
            <div class="code-block small">
              <pre><code>URL: https://{{host}}/api/{{endpoint}}
Header: Authorization: Bearer {{token}}</code></pre>
            </div>
            <p class="card-tip">Press <kbd>v</kbd> to manage environments</p>
          </div>

          <div class="quickstart-card">
            <h3>
              <Icon name="mdi:content-save" size="28" />
              Save & Reuse
            </h3>
            <p class="card-description">Save requests for later:</p>
            <ul class="shortcuts-list">
              <li>Press <kbd>s</kbd> to save current request</li>
              <li>Press <kbd>l</kbd> to load saved requests</li>
              <li>Press <kbd>h</kbd> to view request history</li>
            </ul>
            <p class="card-tip">All data stored in <code>~/.restman/</code></p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <Icon name="mdi:rocket-launch" size="32" />
            <span>RestMan</span>
          </div>
          <div class="footer-links">
            <a href="https://github.com/cadamsdev/restman" target="_blank">
              <Icon name="mdi:github" size="24" />
              GitHub
            </a>
            <a href="https://github.com/cadamsdev/restman/issues" target="_blank">
              <Icon name="mdi:bug" size="24" />
              Report Bug
            </a>
            <a href="https://github.com/cadamsdev/restman/blob/main/LICENSE" target="_blank">
              <Icon name="mdi:license" size="24" />
              MIT License
            </a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>Built with ❤️ by developers, for developers</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const copied = ref(0);

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    const step = copied.value === 0 ? 
      (text.includes('bun.sh') ? 1 : text.includes('git clone') ? 2 : 3) : 0;
    copied.value = step;
    setTimeout(() => {
      copied.value = 0;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>

<style scoped>
/* Hero Section */
.hero {
  min-height: 100vh;
  padding: 2rem 0;
  position: relative;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links a {
  color: #e0e0e0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #667eea;
}

.github-link {
  display: flex;
  align-items: center;
  padding: 0.5rem;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-top: 4rem;
}

.hero-text h1 {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: white;
}

.hero-description {
  font-size: 1.25rem;
  color: #b0b0b0;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.hero-buttons a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Features Section */
.features {
  padding: 6rem 0;
  background: rgba(0, 0, 0, 0.2);
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: white;
}

.section-subtitle {
  text-align: center;
  font-size: 1.25rem;
  color: #b0b0b0;
  margin-bottom: 4rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-icon {
  color: #667eea;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
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
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
}

.code-block {
  background: #1e1e2e;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.code-header {
  background: #2a2a3e;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #8be9fd;
  font-size: 0.875rem;
  font-weight: 500;
}

.copy-btn {
  background: transparent;
  border: none;
  color: #8be9fd;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.copy-btn:hover {
  color: #67d174;
}

.code-block pre {
  padding: 1.5rem;
  margin: 0;
  overflow-x: auto;
}

.code-block code {
  color: #e0e0e0;
  font-size: 0.9rem;
  line-height: 1.6;
}

.code-block.small pre {
  padding: 1rem;
}

.code-block.small code {
  font-size: 0.85rem;
}

.install-note {
  max-width: 800px;
  margin: 3rem auto 0;
  padding: 1.5rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(102, 126, 234, 0.3);
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  color: #8be9fd;
}

.install-note code {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
}

/* Quick Start Section */
.quickstart {
  padding: 6rem 0;
  background: rgba(0, 0, 0, 0.2);
}

.quickstart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.quickstart-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.quickstart-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-description {
  color: #b0b0b0;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.shortcuts-list {
  list-style: none;
  padding: 0;
}

.shortcuts-list li {
  padding: 0.75rem 0;
  color: #b0b0b0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.shortcuts-list li:last-child {
  border-bottom: none;
}

kbd {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: #8be9fd;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-tip {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #8be9fd;
  font-size: 0.9rem;
}

.card-tip code {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
}

/* Footer */
.footer {
  padding: 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-links a {
  color: #b0b0b0;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #667eea;
}

.footer-bottom {
  text-align: center;
  color: #808080;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* Responsive */
@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .hero-text h1 {
    font-size: 2.5rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .nav-links a:not(.github-link) {
    display: none;
  }

  .footer-content {
    flex-direction: column;
    gap: 2rem;
  }

  .install-step {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .hero-text h1 {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-buttons a {
    justify-content: center;
  }
}
</style>

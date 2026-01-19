<template>
  <div class="terminal-window">
    <div class="terminal-header">
      <div class="terminal-button red"></div>
      <div class="terminal-button yellow"></div>
      <div class="terminal-button green"></div>
      <span class="terminal-title">restman</span>
    </div>
    <div class="terminal-body" v-pre>
      <div class="terminal-line">
        <span class="terminal-prompt">$ </span>
        <span class="terminal-command">restman</span>
      </div>
      <div class="terminal-line">
        <span class="terminal-output">🚀 RestMan v1.0.0</span>
      </div>
      <div class="terminal-line empty"></div>
      <div class="terminal-line">
        <span class="terminal-label">┌─ 🌐 URL</span>
      </div>
      <div class="terminal-line">
        <span class="terminal-content">│ https://api.example.com/users</span>
      </div>
      <div class="terminal-line">
        <span class="terminal-label">└─</span>
      </div>
      <div class="terminal-line empty"></div>
      <div class="terminal-line">
        <span class="terminal-label">┌─ 📝 Request [Headers]</span>
      </div>
      <div class="terminal-line">
        <span class="terminal-content">│ Authorization: Bearer {{token}}</span>
      </div>
      <div class="terminal-line">
        <span class="terminal-content">│ Content-Type: application/json</span>
      </div>
      <div class="terminal-line">
        <span class="terminal-label">└─</span>
      </div>
      <div class="terminal-line empty"></div>
      <div class="terminal-line">
        <span class="terminal-label">┌─ 📨 Response [Body]</span>
      </div>
      <div class="terminal-line">
        <span class="terminal-content">│ </span>
        <span class="terminal-json-key">"status"</span>
        <span class="terminal-json-punct">: </span>
        <span class="terminal-json-string">"success"</span>
      </div>
      <div class="terminal-line">
        <span class="terminal-content">│ </span>
        <span class="terminal-json-key">"users"</span>
        <span class="terminal-json-punct">: [</span>
      </div>
      <div class="terminal-line">
        <span class="terminal-content">│   { </span>
        <span class="terminal-json-key">"id"</span>
        <span class="terminal-json-punct">: </span>
        <span class="terminal-json-number">1</span>
        <span class="terminal-json-punct">, </span>
        <span class="terminal-json-key">"name"</span>
        <span class="terminal-json-punct">: </span>
        <span class="terminal-json-string">"Alice"</span>
        <span class="terminal-json-punct"> }</span>
      </div>
      <div class="terminal-line">
        <span class="terminal-content">│ ]</span>
      </div>
      <div class="terminal-line">
        <span class="terminal-label">└─ </span>
        <span class="terminal-status">✓ 200 OK (143ms)</span>
      </div>
      <div class="terminal-line empty"></div>
      <div class="terminal-line">
        <span class="terminal-hint">Enter: Send • e: Edit • h: History • s: Save • /: Help</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-window {
  animation: slideInRight 0.6s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.terminal-title {
  color: #8be9fd;
  font-size: 0.875rem;
  margin-left: 0.5rem;
}

.terminal-line {
  margin-bottom: 0.25rem;
}

.terminal-line.empty {
  margin-bottom: 0.5rem;
}

.terminal-prompt {
  color: #67d174;
  font-weight: 600;
}

.terminal-command {
  color: #f1fa8c;
}

.terminal-output {
  color: #bd93f9;
  font-weight: 500;
}

.terminal-label {
  color: #6272a4;
}

.terminal-content {
  color: #e0e0e0;
}

.terminal-json-key {
  color: #50fa7b;
}

.terminal-json-string {
  color: #f1fa8c;
}

.terminal-json-number {
  color: #bd93f9;
}

.terminal-json-punct {
  color: #8be9fd;
}

.terminal-status {
  color: #50fa7b;
  font-weight: 500;
}

.terminal-hint {
  color: #6272a4;
  font-style: italic;
  font-size: 0.85rem;
}
</style>

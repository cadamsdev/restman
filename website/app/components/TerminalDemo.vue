<template>
  <div class="terminal-window">
    <img src="/images/preview.png" alt="RestMan Terminal Interface Preview" class="preview-image" />
  </div>
</template>

<style scoped>
.terminal-window {
  animation: slideInRight 0.6s ease-out;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  background: var(--color-bg-dark);
  border: 1px solid var(--color-border-light);
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

.preview-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}

/* Terminal component styles (for potential future use) */
.terminal-header {
  background: var(--color-bg-darker);
  padding: 0.75rem var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.terminal-button {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
}

.terminal-button.red {
  background: var(--color-terminal-red);
}

.terminal-button.yellow {
  background: var(--color-terminal-yellow);
}

.terminal-button.green {
  background: var(--color-terminal-green);
}

.terminal-body {
  padding: var(--spacing-md);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-relaxed);
  color: var(--color-code-text);
}

.terminal-prompt {
  color: var(--color-code-prompt);
}

.terminal-command {
  color: var(--color-text-default);
}

.terminal-output {
  color: var(--color-code-output);
}
</style>

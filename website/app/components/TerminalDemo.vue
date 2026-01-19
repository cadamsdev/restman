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
</style>

<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
@import '~/assets/css/main.css';

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-sm);
  }
}
</style>

<script setup lang="ts">
useHead({
  script: [
    {
      src: 'https://media.bitterbrains.com/main.js?from=RESTMAN&type=top',
      async: true,
    },
  ],
});
</script>

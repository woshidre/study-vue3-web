<template>
  <div class="app-layout">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
</script>

<style scoped lang="scss">
.app-layout {
  min-height: 100vh;
  
  .main-content {
    margin-top: 64px; // Header height
    min-height: calc(100vh - 64px);
  }
}
</style> 
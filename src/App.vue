<script setup></script>
<template>
  <div class="h-screen overflow-hidden">
    <router-view />
  </div>
</template>
<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  height: 100vh;
  overflow: hidden;
}
</style>

<template>
  <div class="clock-page">
    <h1>翻页时钟</h1>
    <FlipClock />
  </div>
</template>

<script setup>
import FlipClock from './FlipClock.vue'
</script>

<style scoped>
.clock-page {
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}
</style> 
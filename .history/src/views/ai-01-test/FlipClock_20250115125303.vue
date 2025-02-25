<template>
  <div class="flip-clock">
    <div class="clock-container">
      <!-- 小时 -->
      <div class="flip-wrapper">
        <div class="flip-card" :class="{ 'flip': hourFlip }">
          <div class="top">{{ formatNumber(hours) }}</div>
          <div class="bottom">{{ formatNumber(hours) }}</div>
          <div class="back-top">{{ formatNumber(nextHours) }}</div>
          <div class="back-bottom">{{ formatNumber(nextHours) }}</div>
        </div>
      </div>
      <div class="separator">:</div>
      <!-- 分钟 -->
      <div class="flip-wrapper">
        <div class="flip-card" :class="{ 'flip': minuteFlip }">
          <div class="top">{{ formatNumber(minutes) }}</div>
          <div class="bottom">{{ formatNumber(minutes) }}</div>
          <div class="back-top">{{ formatNumber(nextMinutes) }}</div>
          <div class="back-bottom">{{ formatNumber(nextMinutes) }}</div>
        </div>
      </div>
      <div class="separator">:</div>
      <!-- 秒钟 -->
      <div class="flip-wrapper">
        <div class="flip-card" :class="{ 'flip': secondFlip }">
          <div class="top">{{ formatNumber(seconds) }}</div>
          <div class="bottom">{{ formatNumber(seconds) }}</div>
          <div class="back-top">{{ formatNumber(nextSeconds) }}</div>
          <div class="back-bottom">{{ formatNumber(nextSeconds) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const nextHours = ref(0)
const nextMinutes = ref(0)
const nextSeconds = ref(0)
const hourFlip = ref(false)
const minuteFlip = ref(false)
const secondFlip = ref(false)

let timer = null

const updateTime = () => {
  const now = new Date()
  const newHours = now.getHours()
  const newMinutes = now.getMinutes()
  const newSeconds = now.getSeconds()

  // 更新下一个数字
  nextHours.value = newHours === 23 ? 0 : newHours + 1
  nextMinutes.value = newMinutes === 59 ? 0 : newMinutes + 1
  nextSeconds.value = newSeconds === 59 ? 0 : newSeconds + 1

  // 触发翻转动画
  if (seconds.value !== newSeconds) {
    secondFlip.value = !secondFlip.value
    if (newSeconds === 0) {
      minuteFlip.value = !minuteFlip.value
      if (newMinutes === 0) {
        hourFlip.value = !hourFlip.value
      }
    }
  }

  // 更新当前时间
  hours.value = newHours
  minutes.value = newMinutes
  seconds.value = newSeconds
}

const formatNumber = (num) => {
  return num.toString().padStart(2, '0')
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.flip-clock {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-family: 'Arial', sans-serif;
}

.clock-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.flip-wrapper {
  perspective: 400px;
  width: 60px;
  height: 80px;
}

.flip-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flip-card.flip {
  transform: rotateX(-180deg);
}

.top, .bottom, .back-top, .back-bottom {
  position: absolute;
  width: 100%;
  height: 50%;
  background: #333;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  border-radius: 5px;
}

.top {
  background: #444;
  transform-origin: bottom;
  border-bottom: 1px solid #000;
  z-index: 2;
}

.bottom {
  bottom: 0;
  background: #333;
  transform-origin: top;
  border-top: 1px solid #000;
}

.back-top {
  background: #333;
  transform: rotateX(180deg);
  transform-origin: bottom;
  z-index: 1;
}

.back-bottom {
  bottom: 0;
  background: #444;
  transform: rotateX(180deg);
  transform-origin: top;
}

.separator {
  font-size: 2em;
  color: #333;
  padding: 0 5px;
}
</style> 
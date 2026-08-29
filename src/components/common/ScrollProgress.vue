<template>
  <div class="scroll-progress" :style="{ width: scrollProgress + '%' }" />
</template>

<script setup>
import { useScrollProgress } from '../../composables/useScroll'

const { scrollProgress } = useScrollProgress()
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #0ea5e9 0%, #3b82f6 50%, #8b5cf6 100%);
  z-index: 9999;
  transform-origin: left;
  box-shadow: 0 2px 10px rgba(14, 165, 233, 0.5);
  transition: width 0.1s linear;
}
</style>
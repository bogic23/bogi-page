<template>
  <transition
    name="page"
    mode="out-in"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <slot />
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const isTransitioning = ref(false)

const onBeforeEnter = (el) => {
  isTransitioning.value = true
  el.style.opacity = '0'
  el.style.transform = 'translateY(20px)'
}

const onEnter = (el, done) => {
  requestAnimationFrame(() => {
    el.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
    
    setTimeout(done, 400)
  })
}

const onAfterEnter = () => {
  isTransitioning.value = false
}

const onBeforeLeave = (el) => {
  isTransitioning.value = true
  el.style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
}

const onLeave = (el, done) => {
  el.style.opacity = '0'
  el.style.transform = 'translateY(-20px)'
  setTimeout(done, 300)
}

const onAfterLeave = () => {
  isTransitioning.value = false
}
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  position: absolute;
  width: 100%;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
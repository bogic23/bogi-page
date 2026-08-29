<template>
  <Transition name="loader">
    <div v-if="show" class="page-loader">
      <div class="loader-content">
        <div class="loader-spinner">
          <div class="spinner-ring" />
          <div class="spinner-ring ring-2" />
          <div class="spinner-ring ring-3" />
        </div>
        <p class="loader-text">
          Loading...
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const show = ref(true)
const isTransitioning = ref(false)

const handleRouteChange = async () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  show.value = true
  
  // Minimum display time for smooth UX
  await new Promise(resolve => setTimeout(resolve, 300))
  
  show.value = false
  isTransitioning.value = false
}

onMounted(() => {
  // Hide initial loader after app mounts
  setTimeout(() => {
    show.value = false
  }, 500)
  
  // Watch route changes
  watch(() => route.fullPath, handleRouteChange)
})
</script>

<style scoped>
.page-loader {
  position: fixed;
  inset: 0;
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loader-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border: 3px solid transparent;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

.ring-2 {
  border-top-color: var(--color-secondary);
  animation-delay: -0.4s;
  animation-direction: reverse;
}

.ring-3 {
  border-top-color: #8b5cf6;
  animation-delay: -0.8s;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loader-text {
  color: var(--color-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

.loader-enter-active,
.loader-leave-active {
  transition: opacity 0.3s ease;
}

.loader-enter-from,
.loader-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .spinner-ring {
    animation-duration: 0.01ms !important;
  }
  .loader-enter-active,
  .loader-leave-active {
    transition-duration: 0.01ms !important;
  }
}
</style>
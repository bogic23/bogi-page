<template>
  <div 
    v-ripple="{ color: 'rgba(14,165,233,0.1)' }" 
    class="app-card"
    :class="[`app-card--${variant}`, { 'app-card--hover': hover }]"
  >
    <div v-if="title || $slots.header" class="app-card__header">
      <slot name="header">
        <h3 v-if="title" class="app-card__title">
          {{ title }}
        </h3>
      </slot>
    </div>
    <div class="app-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="app-card__footer">
      <slot name="footer" />
    </div>
    
    <div v-if="hover" class="app-card__shine" />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.app-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: all var(--transition-base);
  border: 1px solid var(--color-border);
  position: relative;
}

.app-card--hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.app-card--hover:hover .app-card__shine {
  animation: shine 1.5s ease-in-out;
}

.app-card__shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  pointer-events: none;
}

@keyframes shine {
  0% { left: -100%; }
  100% { left: 200%; }
}

.app-card__header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.app-card__title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.app-card__body {
  padding: var(--spacing-lg);
}

.app-card__footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-background);
}

/* Variants */
.app-card--primary {
  border-top: 4px solid var(--color-primary);
}

.app-card--primary:hover {
  box-shadow: var(--shadow-xl), 0 0 30px rgba(14, 165, 233, 0.2);
}

.app-card--success {
  border-top: 4px solid var(--color-success);
}

.app-card--success:hover {
  box-shadow: var(--shadow-xl), 0 0 30px rgba(16, 185, 129, 0.2);
}

.app-card--warning {
  border-top: 4px solid var(--color-warning);
}

.app-card--warning:hover {
  box-shadow: var(--shadow-xl), 0 0 30px rgba(245, 158, 11, 0.2);
}

.app-card--danger {
  border-top: 4px solid var(--color-danger);
}

.app-card--danger:hover {
  box-shadow: var(--shadow-xl), 0 0 30px rgba(239, 68, 68, 0.2);
}

@media (prefers-reduced-motion: reduce) {
  .app-card,
  .app-card__shine {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>
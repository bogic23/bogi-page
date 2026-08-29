<template>
  <div class="app-card" :class="[`app-card--${variant}`, { 'app-card--hover': hover }]">
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
}

.app-card--hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
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

.app-card--success {
  border-top: 4px solid var(--color-success);
}

.app-card--warning {
  border-top: 4px solid var(--color-warning);
}

.app-card--danger {
  border-top: 4px solid var(--color-danger);
}
</style>
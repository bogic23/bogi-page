<template>
  <button
    v-ripple="{ color: 'rgba(255,255,255,0.3)' }"
    :type="type"
    class="btn"
    :class="[`btn-${variant}`, { 'btn-sm': size === 'sm', 'btn-lg': size === 'lg' }]"
    :disabled="loading || disabled"
    @click="handleClick"
  >
    <span
      v-if="loading"
      class="spinner-border spinner-border-sm me-2"
      role="status"
      aria-hidden="true"
    />
    <i v-if="icon && !loading" :class="`bi bi-${icon} me-1`" />
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'outline-primary', 'outline-secondary'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  icon: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.btn {
  position: relative;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn:not(:disabled):active {
  transform: translateY(0) scale(0.98);
}

.btn-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.4);
}

.btn-outline-primary {
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  background: transparent;
}

.btn-outline-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  border-color: transparent;
  color: white;
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  border: none;
}

.btn-success:hover:not(:disabled) {
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  border: none;
}

.btn-warning:hover:not(:disabled) {
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  border: none;
}

.btn-danger:hover:not(:disabled) {
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
}

.spinner-border {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .btn,
  .spinner-border {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>
<template>
  <div class="task-card" :class="[`task-card--${task.priority}`, { 'task-card--completed': task.completed }]">
    <div class="d-flex align-items-start">
      <div class="form-check">
        <input 
          class="form-check-input" 
          type="checkbox" 
          :checked="task.completed"
          @change="$emit('toggle', task.id)"
        >
      </div>
      <div class="flex-grow-1 ms-3">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="mb-1" :class="{ 'text-decoration-line-through': task.completed }">
              {{ task.title }}
            </h6>
            <p class="text-muted small mb-2">
              {{ task.description }}
            </p>
          </div>
          <div class="dropdown">
            <button class="btn btn-sm btn-light" data-bs-toggle="dropdown">
              <i class="bi bi-three-dots-vertical" />
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <button class="dropdown-item" @click="$emit('edit', task)">
                  <i class="bi bi-pencil me-2" />Edit
                </button>
              </li>
              <li>
                <button class="dropdown-item" @click="$emit('toggle', task.id)">
                  <i :class="task.completed ? 'bi bi-arrow-counterclockwise me-2' : 'bi bi-check-circle me-2'" />
                  {{ task.completed ? 'Mark Incomplete' : 'Mark Complete' }}
                </button>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item text-danger" @click="$emit('delete', task.id)">
                  <i class="bi bi-trash me-2" />Delete
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div class="d-flex flex-wrap gap-2 mt-2">
          <span class="badge bg-light text-muted">
            <i class="bi bi-folder me-1" />{{ task.category }}
          </span>
          <span class="badge" :class="priorityBadgeClass">
            <i class="bi bi-flag me-1" />{{ task.priority }}
          </span>
          <span class="badge bg-light text-muted">
            <i class="bi bi-calendar me-1" />{{ formatDueDate(task.dueDate) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDueDate } from '../../utils/date'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['toggle', 'edit', 'delete'])

const priorityBadgeClass = computed(() => {
  switch (props.task.priority) {
    case 'high':
      return 'bg-danger'
    case 'medium':
      return 'bg-warning text-dark'
    case 'low':
      return 'bg-info'
    default:
      return 'bg-light text-muted'
  }
})
</script>

<style scoped>
.task-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  border-left: 4px solid var(--color-border);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.task-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.task-card--high {
  border-left-color: var(--color-danger);
}

.task-card--medium {
  border-left-color: var(--color-warning);
}

.task-card--low {
  border-left-color: var(--color-info);
}

.task-card--completed {
  opacity: 0.7;
  border-left-color: var(--color-success);
}
</style>
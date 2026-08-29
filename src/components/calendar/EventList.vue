<template>
  <div class="event-list">
    <div v-if="events.length">
      <div 
        v-for="event in events" 
        :key="event.id"
        class="event-item mb-3"
        :class="`event-item--${event.category}`"
      >
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="mb-1">
              {{ event.title }}
            </h6>
            <p class="text-muted small mb-2">
              {{ event.description }}
            </p>
            <div class="d-flex flex-wrap gap-2">
              <span class="badge bg-light text-muted">
                <i class="bi bi-clock me-1" />
                {{ formatEventTime(event.date) }}
                <template v-if="event.endDate">
                  - {{ formatEventTime(event.endDate) }}
                </template>
              </span>
              <span v-if="event.location" class="badge bg-light text-muted">
                <i class="bi bi-geo-alt me-1" />{{ event.location }}
              </span>
              <span class="badge" :class="getCategoryBadgeClass(event.category)">
                {{ event.category }}
              </span>
            </div>
          </div>
          <div class="dropdown">
            <button class="btn btn-sm btn-light" data-bs-toggle="dropdown">
              <i class="bi bi-three-dots-vertical" />
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <button class="dropdown-item" @click="$emit('edit', event)">
                  <i class="bi bi-pencil me-2" />Edit
                </button>
              </li>
              <li>
                <button class="dropdown-item text-danger" @click="$emit('delete', event.id)">
                  <i class="bi bi-trash me-2" />Delete
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-4">
      <i class="bi bi-calendar-x fs-1 text-muted" />
      <p class="text-muted mt-3 mb-0">
        No events for this day
      </p>
    </div>
  </div>
</template>

<script setup>
import { formatEventTime } from '../../utils/date'

defineProps({
  events: {
    type: Array,
    default: () => []
  }
})

defineEmits(['edit', 'delete'])

function getCategoryBadgeClass(category) {
  switch (category) {
    case 'meeting': return 'bg-primary'
    case 'deadline': return 'bg-danger'
    case 'learning': return 'bg-success'
    case 'personal': return 'bg-warning text-dark'
    case 'work': return 'bg-secondary'
    default: return 'bg-light text-muted'
  }
}
</script>

<style scoped>
.event-item {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border-left: 4px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.event-item--meeting {
  border-left-color: var(--color-primary);
}

.event-item--deadline {
  border-left-color: var(--color-danger);
}

.event-item--learning {
  border-left-color: var(--color-success);
}

.event-item--personal {
  border-left-color: var(--color-warning);
}

.event-item--work {
  border-left-color: var(--color-secondary);
}
</style>
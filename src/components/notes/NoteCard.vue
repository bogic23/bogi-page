<template>
  <div class="note-card" :class="{ 'note-card--pinned': note.pinned }">
    <div class="note-card-header">
      <h5 class="note-title mb-1">
        {{ note.title }}
      </h5>
      <div class="note-actions">
        <button 
          class="btn btn-sm btn-light" 
          :class="{ 'text-warning': note.pinned }"
          :title="note.pinned ? 'Unpin note' : 'Pin note'"
          @click="$emit('toggle-pin', note.id)"
        >
          <i :class="note.pinned ? 'bi bi-pin-fill' : 'bi bi-pin'" />
        </button>
        <div class="dropdown">
          <button class="btn btn-sm btn-light" data-bs-toggle="dropdown">
            <i class="bi bi-three-dots-vertical" />
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <button class="dropdown-item" @click="$emit('edit', note)">
                <i class="bi bi-pencil me-2" />Edit
              </button>
            </li>
            <li>
              <button class="dropdown-item text-danger" @click="$emit('delete', note.id)">
                <i class="bi bi-trash me-2" />Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="note-preview" @click="$emit('view', note)">
      {{ truncateText(note.content, 150) }}
    </div>
    
    <div class="note-footer">
      <div class="note-tags">
        <span 
          v-for="tag in note.tags?.slice(0, 3)" 
          :key="tag" 
          class="badge bg-light text-muted me-1"
        >
          #{{ tag }}
        </span>
      </div>
      <div class="note-meta">
        <span class="badge bg-light text-muted me-2">{{ note.category }}</span>
        <small class="text-muted">{{ getRelativeTime(note.updatedAt) }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { truncateText } from '../../utils/format'
import { getRelativeTime } from '../../utils/date'

defineProps({
  note: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'delete', 'toggle-pin'])
</script>

<style scoped>
.note-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  cursor: pointer;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.note-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.note-card--pinned {
  border: 2px solid var(--color-warning);
}

.note-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
}

.note-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-right: var(--spacing-sm);
}

.note-actions {
  display: flex;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.note-preview {
  color: var(--color-muted);
  font-size: 0.9rem;
  margin-bottom: var(--spacing-md);
  flex-grow: 1;
  cursor: pointer;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}
</style>
<template>
  <div 
    class="lesson-card" 
    :class="{ 'lesson-card--completed': lesson.completed }"
    @click="$emit('select', lesson)"
  >
    <div class="d-flex align-items-center">
      <div class="lesson-icon me-3">
        <i :class="getLessonIcon(lesson.type)" />
      </div>
      <div class="flex-grow-1">
        <h6 class="mb-1">
          {{ lesson.title }}
        </h6>
        <div class="d-flex align-items-center">
          <span class="badge bg-light text-muted me-2">{{ lesson.type }}</span>
          <small class="text-muted">{{ lesson.duration }}</small>
        </div>
      </div>
      <div class="lesson-status">
        <i 
          v-if="lesson.completed" 
          class="bi bi-check-circle-fill text-success"
        />
        <i 
          v-else 
          class="bi bi-circle text-muted"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  lesson: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])

const getLessonIcon = (type) => {
  switch (type) {
    case 'video':
      return 'bi bi-play-circle'
    case 'text':
      return 'bi bi-file-text'
    case 'quiz':
      return 'bi bi-question-circle'
    case 'audio':
      return 'bi bi-music-note'
    default:
      return 'bi bi-file'
  }
}
</script>

<style scoped>
.lesson-card {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid var(--color-border);
}

.lesson-card:hover {
  background: var(--color-background);
  border-color: var(--color-primary);
}

.lesson-card--completed {
  background: rgba(16, 185, 129, 0.05);
}

.lesson-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  font-size: 1.2rem;
}

.lesson-status {
  font-size: 1.2rem;
}
</style>
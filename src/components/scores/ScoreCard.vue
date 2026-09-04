<template>
  <AppCard variant="default" hover class="h-100 score-card">
    <div class="score-icon">
      <i class="bi bi-file-earmark-music" />
    </div>
    
    <div class="score-info">
      <h6 class="score-title" :title="score.name">
        {{ score.name }}
      </h6>
      <div class="score-meta">
        <span class="score-size">
          <i class="bi bi-hdd me-1" />
          {{ score.formattedSize }}
        </span>
        <span class="score-date">
          <i class="bi bi-calendar me-1" />
          {{ score.formattedDate }}
        </span>
      </div>
    </div>

    <div class="score-actions">
      <AppButton 
        size="sm" 
        variant="outline-primary" 
        icon="eye" 
        class="action-btn"
        title="View"
        @click="$emit('view', score)"
      />
      <AppButton 
        size="sm" 
        variant="outline-secondary" 
        icon="download" 
        class="action-btn"
        title="Download"
        @click="$emit('download', score)"
      />
      <AppButton 
        size="sm" 
        variant="outline-danger" 
        icon="trash" 
        class="action-btn"
        title="Delete"
        @click="$emit('delete', score)"
      />
    </div>
  </AppCard>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'

defineProps({
  score: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'download', 'delete'])
</script>

<style scoped>
.score-card {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
}

.score-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.score-info {
  flex: 1;
  min-width: 0;
}

.score-title {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.score-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: var(--font-size-sm);
  color: var(--color-muted);
}

.score-actions {
  display: flex;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs) var(--spacing-sm);
}

.action-btn i {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .score-actions {
    flex-wrap: wrap;
  }
  
  .action-btn {
    flex: 0 0 calc(50% - 4px);
  }
}
</style>
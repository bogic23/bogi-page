<template>
  <AppCard hover class="course-card h-100">
    <div class="course-image" :class="{ 'course-image--placeholder': !course.image }">
      <i class="bi bi-music-note-beamed" />
    </div>
    <div class="course-body p-4">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <span class="badge bg-primary">{{ course.category }}</span>
        <span class="badge bg-light text-muted">{{ course.level }}</span>
      </div>
      <h5 class="mb-2">
        {{ course.title }}
      </h5>
      <p class="text-muted mb-3">
        {{ course.description }}
      </p>
      
      <div class="course-meta mb-3">
        <div class="d-flex align-items-center mb-2">
          <i class="bi bi-person me-2 text-muted" />
          <span class="text-muted">{{ course.instructor }}</span>
        </div>
        <div class="d-flex align-items-center mb-2">
          <i class="bi bi-clock me-2 text-muted" />
          <span class="text-muted">{{ course.duration }}</span>
        </div>
        <div class="d-flex align-items-center">
          <i class="bi bi-people me-2 text-muted" />
          <span class="text-muted">{{ course.studentsCount }} students</span>
        </div>
      </div>
      
      <div class="course-rating mb-3">
        <div class="d-flex align-items-center">
          <div class="stars me-2">
            <i 
              v-for="star in 5" 
              :key="star" 
              :class="star <= Math.round(course.rating) ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"
            />
          </div>
          <span class="text-muted">{{ course.rating }}</span>
        </div>
      </div>
      
      <div v-if="course.enrolled" class="course-progress mb-3">
        <div class="d-flex justify-content-between mb-1">
          <small class="text-muted">Progress</small>
          <small class="text-muted">{{ course.progress }}%</small>
        </div>
        <div class="progress" style="height: 6px;">
          <div 
            class="progress-bar bg-gradient-primary" 
            :style="{ width: course.progress + '%' }"
          />
        </div>
      </div>
      
      <div class="d-grid">
        <button 
          v-if="course.enrolled" 
          class="btn btn-primary"
          @click="$emit('continue', course)"
        >
          <i class="bi bi-play-circle me-1" />
          {{ course.progress > 0 ? 'Continue Learning' : 'Start Course' }}
        </button>
        <button 
          v-else 
          class="btn btn-outline-primary"
          @click="$emit('enroll', course)"
        >
          <i class="bi bi-plus-circle me-1" />
          Enroll Now
        </button>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import AppCard from '../common/AppCard.vue'

defineProps({
  course: {
    type: Object,
    required: true
  }
})

defineEmits(['continue', 'enroll'])
</script>

<style scoped>
.course-card {
  transition: transform var(--transition-base);
}

.course-card:hover {
  transform: translateY(-4px);
}

.course-image {
  height: 180px;
  background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-image i {
  font-size: 4rem;
  color: var(--color-primary);
}

.course-rating .stars {
  font-size: 0.9rem;
}
</style>
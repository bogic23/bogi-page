<template>
  <div class="course-detail-view py-5">
    <div class="container">
      <div v-if="course">
        <!-- Course Header -->
        <div class="row mb-4">
          <div class="col-lg-8">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/learning/courses">
                    Courses
                  </router-link>
                </li>
                <li class="breadcrumb-item active">
                  {{ course.title }}
                </li>
              </ol>
            </nav>
            <h1 class="display-6 fw-bold mb-3">
              {{ course.title }}
            </h1>
            <p class="lead text-muted mb-3">
              {{ course.description }}
            </p>
            <div class="d-flex flex-wrap gap-3 mb-3">
              <span class="badge bg-primary">{{ course.category }}</span>
              <span class="badge bg-light text-muted">{{ course.level }}</span>
              <span class="badge bg-light text-muted">
                <i class="bi bi-person me-1" />{{ course.instructor }}
              </span>
              <span class="badge bg-light text-muted">
                <i class="bi bi-clock me-1" />{{ course.duration }}
              </span>
            </div>
          </div>
          <div class="col-lg-4">
            <AppCard>
              <h5 class="mb-3">
                Course Progress
              </h5>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Completion</span>
                <span>{{ course.progress }}%</span>
              </div>
              <div class="progress mb-3" style="height: 10px;">
                <div 
                  class="progress-bar bg-gradient-primary" 
                  :style="{ width: course.progress + '%' }"
                />
              </div>
              <button 
                v-if="course.modules?.length"
                class="btn btn-primary w-100"
                @click="continueLearning"
              >
                <i class="bi bi-play-circle me-1" />
                Continue Learning
              </button>
            </AppCard>
          </div>
        </div>
        
        <!-- Course Content -->
        <div class="row">
          <div class="col-12">
            <h3 class="mb-4">
              Course Content
            </h3>
            <div v-for="module in course.modules" :key="module.id" class="mb-4">
              <AppCard>
                <template #header>
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="mb-1">
                        Module {{ module.order }}: {{ module.title }}
                      </h5>
                      <p class="text-muted mb-0">
                        {{ module.description }}
                      </p>
                    </div>
                    <span class="badge bg-light text-muted">
                      {{ module.lessons?.length || 0 }} lessons
                    </span>
                  </div>
                </template>
                <div class="lesson-list">
                  <LessonCard 
                    v-for="lesson in module.lessons" 
                    :key="lesson.id"
                    :lesson="lesson"
                    @select="selectLesson"
                  />
                </div>
              </AppCard>
            </div>
            
            <div v-if="!course.modules?.length" class="text-center py-5">
              <i class="bi bi-hourglass-split fs-1 text-muted" />
              <h5 class="mt-3">
                Course content coming soon
              </h5>
              <p class="text-muted">
                This course is currently under development
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLearningStore } from '../../stores/learningStore'
import AppCard from '../../components/common/AppCard.vue'
import LessonCard from '../../components/learning/LessonCard.vue'

const route = useRoute()
const router = useRouter()
const learningStore = useLearningStore()

const course = computed(() => {
  const courseId = parseInt(route.params.id)
  return learningStore.getCourseById(courseId)
})

const selectLesson = (lesson) => {
  if (lesson.type === 'quiz' && lesson.quiz) {
    router.push(`/learning/course/${course.value.id}/quiz/${lesson.quiz.id}`)
  } else {
    router.push(`/learning/course/${course.value.id}/lesson/${lesson.id}`)
  }
}

const continueLearning = () => {
  // Find first incomplete lesson
  for (const module of course.value.modules) {
    const incompleteLesson = module.lessons?.find(lesson => !lesson.completed)
    if (incompleteLesson) {
      selectLesson(incompleteLesson)
      return
    }
  }
  // If all complete, go to first lesson
  if (course.value.modules[0]?.lessons?.[0]) {
    selectLesson(course.value.modules[0].lessons[0])
  }
}

onMounted(() => {
  if (route.params.id) {
    learningStore.setCurrentCourse(parseInt(route.params.id))
  }
})
</script>

<style scoped>
.lesson-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
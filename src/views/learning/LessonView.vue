<template>
  <div class="lesson-view py-5">
    <div class="container">
      <div v-if="lesson" class="row">
        <!-- Lesson Content -->
        <div class="col-lg-8">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link to="/learning/courses">
                  Courses
                </router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link :to="`/learning/course/${courseId}`">
                  Course
                </router-link>
              </li>
              <li class="breadcrumb-item active">
                {{ lesson.title }}
              </li>
            </ol>
          </nav>
          
          <AppCard class="mb-4">
            <div class="lesson-header mb-4">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h1 class="h3 mb-2">
                    {{ lesson.title }}
                  </h1>
                  <div class="d-flex gap-2">
                    <span class="badge bg-light text-muted">{{ lesson.type }}</span>
                    <span class="badge bg-light text-muted">{{ lesson.duration }}</span>
                  </div>
                </div>
                <button 
                  v-if="lesson.completed"
                  class="btn btn-sm btn-success"
                  disabled
                >
                  <i class="bi bi-check-circle me-1" />Completed
                </button>
              </div>
            </div>
            
            <div class="lesson-content">
              <!-- Video placeholder -->
              <div v-if="lesson.type === 'video'" class="video-placeholder mb-4">
                <i class="bi bi-play-circle" />
                <p>Video content will be displayed here</p>
              </div>
              
              <!-- Audio placeholder -->
              <div v-if="lesson.type === 'audio'" class="audio-placeholder mb-4">
                <i class="bi bi-music-note-beamed" />
                <p>Audio content will be displayed here</p>
              </div>
              
              <!-- Text content -->
              <div class="text-content">
                <p>{{ lesson.content }}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </div>
            
            <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <button 
                class="btn btn-light"
                :disabled="!hasPreviousLesson"
                @click="previousLesson"
              >
                <i class="bi bi-arrow-left me-1" />Previous
              </button>
              <button 
                class="btn btn-primary"
                @click="completeAndContinue"
              >
                Complete & Continue
                <i class="bi bi-arrow-right ms-1" />
              </button>
            </div>
          </AppCard>
        </div>
        
        <!-- Lesson Navigation -->
        <div class="col-lg-4">
          <AppCard title="Course Content">
            <div v-for="module in currentCourse?.modules" :key="module.id" class="mb-3">
              <h6 class="text-muted mb-2">
                Module {{ module.order }}: {{ module.title }}
              </h6>
              <div class="lesson-nav-list">
                <div 
                  v-for="moduleLesson in module.lessons" 
                  :key="moduleLesson.id"
                  class="lesson-nav-item"
                  :class="{ 
                    'lesson-nav-item--active': moduleLesson.id === lesson.id,
                    'lesson-nav-item--completed': moduleLesson.completed 
                  }"
                  @click="navigateToLesson(moduleLesson)"
                >
                  <i 
                    :class="moduleLesson.completed ? 'bi bi-check-circle-fill text-success' : 'bi bi-circle text-muted'"
                  />
                  <span>{{ moduleLesson.title }}</span>
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLearningStore } from '../../stores/learningStore'
import { useAppStore } from '../../stores/appStore'
import AppCard from '../../components/common/AppCard.vue'

const route = useRoute()
const router = useRouter()
const learningStore = useLearningStore()
const appStore = useAppStore()

const courseId = parseInt(route.params.id)
const lessonId = parseInt(route.params.lessonId)

const currentCourse = computed(() => learningStore.currentCourse)
const lesson = computed(() => learningStore.currentLesson)

const hasPreviousLesson = computed(() => {
  if (!currentCourse.value) return false
  let foundCurrent = false
  
  for (let i = currentCourse.value.modules.length - 1; i >= 0; i--) {
    const module = currentCourse.value.modules[i]
    for (let j = module.lessons.length - 1; j >= 0; j--) {
      if (foundCurrent) return true
      if (module.lessons[j].id === lessonId) {
        foundCurrent = true
      }
    }
  }
  return false
})

const completeAndContinue = () => {
  if (currentCourse.value && lesson.value) {
    learningStore.completeLesson(currentCourse.value.id, lesson.value.id)
    
    appStore.addNotification({
      title: 'Lesson Completed',
      message: `You have completed "${lesson.value.title}"`
    })
    
    // Navigate to next lesson
    navigateToNextLesson()
  }
}

const navigateToNextLesson = () => {
  if (!currentCourse.value) return
  
  let foundCurrent = false
  
  for (const module of currentCourse.value.modules) {
    for (const moduleLesson of module.lessons) {
      if (foundCurrent) {
        navigateToLesson(moduleLesson)
        return
      }
      if (moduleLesson.id === lessonId) {
        foundCurrent = true
      }
    }
  }
  
  // If no next lesson, go back to course
  router.push(`/learning/course/${courseId}`)
}

const navigateToLesson = (moduleLesson) => {
  if (moduleLesson.type === 'quiz' && moduleLesson.quiz) {
    router.push(`/learning/course/${courseId}/quiz/${moduleLesson.quiz.id}`)
  } else {
    router.push(`/learning/course/${courseId}/lesson/${moduleLesson.id}`)
  }
}

const previousLesson = () => {
  if (!currentCourse.value) return
  
  let previous = null
  
  for (const module of currentCourse.value.modules) {
    for (const moduleLesson of module.lessons) {
      if (moduleLesson.id === lessonId) {
        if (previous) {
          navigateToLesson(previous)
        }
        return
      }
      previous = moduleLesson
    }
  }
}

onMounted(() => {
  learningStore.setCurrentCourse(courseId)
  learningStore.setCurrentLesson(lessonId)
})
</script>

<style scoped>
.video-placeholder,
.audio-placeholder {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: var(--radius-lg);
  padding: 3rem;
  text-align: center;
  color: var(--color-muted);
}

.video-placeholder i,
.audio-placeholder i {
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.lesson-nav-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.lesson-nav-item {
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: background var(--transition-fast);
}

.lesson-nav-item:hover {
  background: var(--color-background);
}

.lesson-nav-item--active {
  background: rgba(14, 165, 233, 0.1);
  color: var(--color-primary);
  font-weight: 500;
}

.lesson-nav-item--completed {
  opacity: 0.7;
}
</style>
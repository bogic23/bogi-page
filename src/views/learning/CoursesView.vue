<template>
  <div class="courses-view py-5">
    <div class="container">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col-lg-8">
          <h1 class="display-5 fw-bold mb-2">
            Courses
          </h1>
          <p class="lead text-muted">
            Learn music theory, production, and composition at your own pace
          </p>
        </div>
        <div class="col-lg-4 text-lg-end mt-3 mt-lg-0">
          <div class="d-flex gap-2 justify-content-lg-end">
            <button class="btn btn-outline-secondary" @click="showAll = !showAll">
              <i :class="showAll ? 'bi bi-grid-3x3' : 'bi bi-list'" />
              <span class="ms-1 d-none d-sm-inline">{{ showAll ? 'Grid' : 'List' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3 mb-md-0">
          <AppCard class="text-center py-3 bg-gradient-primary text-white">
            <div class="fs-3 fw-bold">
              {{ totalLessons }}
            </div>
            <small>Total Lessons</small>
          </AppCard>
        </div>
        <div class="col-md-3 mb-3 mb-md-0">
          <AppCard class="text-center py-3 bg-gradient-success text-white">
            <div class="fs-3 fw-bold">
              {{ completedLessons }}
            </div>
            <small>Completed</small>
          </AppCard>
        </div>
        <div class="col-md-3 mb-3 mb-md-0">
          <AppCard class="text-center py-3 bg-gradient-info text-white">
            <div class="fs-3 fw-bold">
              {{ overallProgress }}%
            </div>
            <small>Overall Progress</small>
          </AppCard>
        </div>
        <div class="col-md-3">
          <AppCard class="text-center py-3 bg-gradient-warning text-white">
            <div class="fs-3 fw-bold">
              {{ enrolledCourses.length }}
            </div>
            <small>Enrolled Courses</small>
          </AppCard>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-4">
        <div class="col-12">
          <AppCard class="p-3">
            <div class="d-flex flex-wrap gap-3 align-items-center">
              <div class="input-group" style="max-width: 300px;">
                <span class="input-group-text bg-transparent border-end-0">
                  <i class="bi bi-search text-muted" />
                </span>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control border-start-0"
                  placeholder="Search courses..."
                >
              </div>
              <select v-model="categoryFilter" class="form-select" style="width: auto;">
                <option value="">
                  All Categories
                </option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
              <select v-model="levelFilter" class="form-select" style="width: auto;">
                <option value="">
                  All Levels
                </option>
                <option value="Beginner">
                  Beginner
                </option>
                <option value="Intermediate">
                  Intermediate
                </option>
                <option value="Advanced">
                  Advanced
                </option>
              </select>
              <select v-model="enrollmentFilter" class="form-select" style="width: auto;">
                <option value="">
                  All Courses
                </option>
                <option value="enrolled">
                  Enrolled
                </option>
                <option value="not-enrolled">
                  Not Enrolled
                </option>
              </select>
            </div>
          </AppCard>
        </div>
      </div>

      <!-- Courses Grid -->
      <div v-if="filteredCourses.length > 0" class="row g-4">
        <div 
          v-for="course in filteredCourses" 
          :key="course.id"
          :class="showAll ? 'col-xl-4 col-lg-6 col-md-6' : 'col-12'"
        >
          <CourseCard 
            :course="course" 
            @continue="continueCourse"
            @enroll="enrollInCourse"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-5">
        <AppCard class="max-w-md mx-auto">
          <i class="bi bi-search fs-1 text-muted mb-3" />
          <h5>No courses found</h5>
          <p class="text-muted">
            Try adjusting your filters or search query
          </p>
          <button class="btn btn-outline-primary" @click="resetFilters">
            <i class="bi bi-arrow-clockwise me-1" />Reset Filters
          </button>
        </AppCard>
      </div>

      <!-- Achievements Section -->
      <div class="row mt-5">
        <div class="col-12">
          <h3 class="mb-4">
            Achievements
          </h3>
          <div class="row g-3">
            <div v-for="achievement in achievements" :key="achievement.id" class="col-md-4 col-sm-6">
              <AppCard 
                class="text-center py-4" 
                :class="{ 'achievement--unlocked': achievement.unlocked, 'achievement--locked': !achievement.unlocked }"
              >
                <i :class="[achievement.icon + ' fs-1 mb-3', achievement.unlocked ? 'text-warning' : 'text-muted']" />
                <h6 class="mb-1">
                  {{ achievement.name }}
                </h6>
                <p class="text-muted small mb-0">
                  {{ achievement.description }}
                </p>
              </AppCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLearningStore } from '../../stores/learningStore'
import { useAppStore } from '../../stores/appStore'
import AppCard from '../../components/common/AppCard.vue'
import CourseCard from '../../components/learning/CourseCard.vue'

const router = useRouter()
const learningStore = useLearningStore()
const appStore = useAppStore()

const searchQuery = ref('')
const categoryFilter = ref('')
const levelFilter = ref('')
const enrollmentFilter = ref('')
const showAll = ref(true)

const categories = computed(() => {
  const cats = new Set(learningStore.courses.map(c => c.category))
  return Array.from(cats).sort()
})

const filteredCourses = computed(() => {
  return learningStore.courses.filter(course => {
    const matchesSearch = !searchQuery.value || 
      course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesCategory = !categoryFilter.value || course.category === categoryFilter.value
    const matchesLevel = !levelFilter.value || course.level === levelFilter.value
    const matchesEnrollment = !enrollmentFilter.value || 
      (enrollmentFilter.value === 'enrolled' && course.enrolled) ||
      (enrollmentFilter.value === 'not-enrolled' && !course.enrolled)
    
    return matchesSearch && matchesCategory && matchesLevel && matchesEnrollment
  })
})

const { 
  totalLessons, 
  completedLessons, 
  overallProgress, 
  enrolledCourses, 
  achievements 
} = learningStore

const continueCourse = (course) => {
  learningStore.setCurrentCourse(course.id)
  // Navigate to first incomplete lesson or course detail
  if (course.modules?.[0]?.lessons?.[0]) {
    const firstLesson = course.modules[0].lessons[0]
    if (firstLesson.type === 'quiz' && firstLesson.quiz) {
      router.push(`/learning/course/${course.id}/quiz/${firstLesson.quiz.id}`)
    } else {
      router.push(`/learning/course/${course.id}/lesson/${firstLesson.id}`)
    }
  } else {
    router.push(`/learning/course/${course.id}`)
  }
}

const enrollInCourse = (course) => {
  learningStore.enrollInCourse(course.id)
  appStore.addNotification({
    title: 'Enrolled!',
    message: `You are now enrolled in "${course.title}"`
  })
}

const resetFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  levelFilter.value = ''
  enrollmentFilter.value = ''
}

onMounted(() => {
  // Initialize any needed data
})
</script>

<style scoped>
.achievement--locked {
  opacity: 0.5;
}

.achievement--unlocked {
  border-left: 4px solid var(--color-warning);
}

.course-card {
  height: 100%;
}

@media (max-width: 768px) {
  .d-flex.justify-content-lg-end {
    justify-content: center !important;
  }
}
</style>
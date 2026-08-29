<template>
  <div class="courses-view py-5">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-5">
        <h1 class="display-5 fw-bold mb-3">
          Learning Center
        </h1>
        <p class="lead text-muted">
          Expand your musical knowledge with our curated courses
        </p>
      </div>
      
      <!-- Learning Stats -->
      <div class="row mb-5">
        <div class="col-md-3 mb-3">
          <AppCard variant="primary" class="text-center h-100">
            <i class="bi bi-book fs-2 text-primary mb-2" />
            <h3 class="h4 mb-1">
              {{ learningStore.enrolledCourses.length }}
            </h3>
            <p class="text-muted mb-0">
              Enrolled Courses
            </p>
          </AppCard>
        </div>
        <div class="col-md-3 mb-3">
          <AppCard variant="success" class="text-center h-100">
            <i class="bi bi-check-circle fs-2 text-success mb-2" />
            <h3 class="h4 mb-1">
              {{ learningStore.completedLessons }}
            </h3>
            <p class="text-muted mb-0">
              Lessons Completed
            </p>
          </AppCard>
        </div>
        <div class="col-md-3 mb-3">
          <AppCard variant="info" class="text-center h-100">
            <i class="bi bi-graph-up fs-2 text-info mb-2" />
            <h3 class="h4 mb-1">
              {{ learningStore.overallProgress }}%
            </h3>
            <p class="text-muted mb-0">
              Overall Progress
            </p>
          </AppCard>
        </div>
        <div class="col-md-3 mb-3">
          <AppCard variant="warning" class="text-center h-100">
            <i class="bi bi-trophy fs-2 text-warning mb-2" />
            <h3 class="h4 mb-1">
              {{ unlockedAchievements }}
            </h3>
            <p class="text-muted mb-0">
              Achievements
            </p>
          </AppCard>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="mb-0">
          Available Courses
        </h3>
        <div class="btn-group">
          <button 
            v-for="filter in filters" 
            :key="filter.value"
            class="btn"
            :class="activeFilter === filter.value ? 'btn-primary' : 'btn-light'"
            @click="activeFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
      
      <!-- Course Grid -->
      <div class="row">
        <div v-for="course in filteredCourses" :key="course.id" class="col-md-6 col-lg-4 mb-4">
          <CourseCard 
            :course="course"
            @continue="continueCourse"
            @enroll="enrollCourse"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLearningStore } from '../../stores/learningStore'
import { useAppStore } from '../../stores/appStore'
import AppCard from '../../components/common/AppCard.vue'
import CourseCard from '../../components/learning/CourseCard.vue'

const router = useRouter()
const learningStore = useLearningStore()
const appStore = useAppStore()

const activeFilter = ref('all')
const filters = [
  { label: 'All Courses', value: 'all' },
  { label: 'Enrolled', value: 'enrolled' },
  { label: 'Available', value: 'available' }
]

const unlockedAchievements = computed(() => 
  learningStore.achievements.filter(a => a.unlocked).length
)

const filteredCourses = computed(() => {
  switch (activeFilter.value) {
    case 'enrolled':
      return learningStore.enrolledCourses
    case 'available':
      return learningStore.courses.filter(c => !c.enrolled)
    default:
      return learningStore.courses
  }
})

const continueCourse = (course) => {
  learningStore.setCurrentCourse(course.id)
  router.push(`/learning/course/${course.id}`)
}

const enrollCourse = (course) => {
  learningStore.enrollInCourse(course.id)
  appStore.addNotification({
    title: 'Enrolled in Course',
    message: `You have successfully enrolled in "${course.title}"`
  })
  learningStore.setCurrentCourse(course.id)
  router.push(`/learning/course/${course.id}`)
}
</script>
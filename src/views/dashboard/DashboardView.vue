<template>
  <div class="dashboard-view">
    <!-- Welcome Section -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="welcome-card bg-gradient-primary text-white p-4 rounded-3">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 class="h3 mb-2">
                {{ authStore.isAuthenticated ? `Welcome back, ${authStore.user?.displayName || 'Bogi'}` : 'Welcome to Bogi Page!' }} 👋
              </h1>
              <p class="mb-0 opacity-75">
                {{ currentDate }}
              </p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-light" @click="quickAddTask">
                <i class="bi bi-plus-lg me-1" />
                Quick Add
              </button>
              <template v-if="!authStore.isAuthenticated">
                <router-link to="/login" class="btn btn-outline-light">
                  <i class="bi bi-box-arrow-in-right me-1" />
                  Login to Sync
                </router-link>
              </template>
            </div>
          </div>
        </div>
        <template v-if="!authStore.isAuthenticated">
          <div class="alert alert-info mt-3 mb-0">
            <i class="bi bi-info-circle me-2" />
            You're browsing as a guest. Your tasks, notes, and events will be saved in your browser.
            <router-link to="/login" class="alert-link ms-2">Login</router-link> or <router-link to="/register" class="alert-link">register</router-link> to sync across devices.
          </div>
        </template>
      </div>
    </div>
    
    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-md-3 col-sm-6 mb-3">
        <AppCard variant="primary" class="stat-card">
          <div class="d-flex align-items-center">
            <div class="stat-icon bg-primary bg-opacity-10 text-primary">
              <i class="bi bi-check2-square" />
            </div>
            <div class="ms-3">
              <h3 class="h5 mb-1">
                {{ taskStore.incompleteTasks.length }}
              </h3>
              <p class="text-muted mb-0">
                Active Tasks
              </p>
            </div>
          </div>
        </AppCard>
      </div>
      
      <div class="col-md-3 col-sm-6 mb-3">
        <AppCard variant="success" class="stat-card">
          <div class="d-flex align-items-center">
            <div class="stat-icon bg-success bg-opacity-10 text-success">
              <i class="bi bi-check-circle" />
            </div>
            <div class="ms-3">
              <h3 class="h5 mb-1">
                {{ taskStore.completedTasks.length }}
              </h3>
              <p class="text-muted mb-0">
                Completed
              </p>
            </div>
          </div>
        </AppCard>
      </div>
      
      <div class="col-md-3 col-sm-6 mb-3">
        <AppCard variant="warning" class="stat-card">
          <div class="d-flex align-items-center">
            <div class="stat-icon bg-warning bg-opacity-10 text-warning">
              <i class="bi bi-calendar-event" />
            </div>
            <div class="ms-3">
              <h3 class="h5 mb-1">
                {{ upcomingEvents.length }}
              </h3>
              <p class="text-muted mb-0">
                Upcoming Events
              </p>
            </div>
          </div>
        </AppCard>
      </div>
      
      <div class="col-md-3 col-sm-6 mb-3">
        <AppCard variant="info" class="stat-card">
          <div class="d-flex align-items-center">
            <div class="stat-icon bg-info bg-opacity-10 text-info">
              <i class="bi bi-mortarboard" />
            </div>
            <div class="ms-3">
              <h3 class="h5 mb-1">
                {{ activeCourse?.progress || 0 }}%
              </h3>
              <p class="text-muted mb-0">
                Course Progress
              </p>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
    
    <div class="row">
      <!-- Recent Notes -->
      <div class="col-lg-6 mb-4">
        <AppCard title="Recent Notes">
          <div v-if="noteStore.recentNotes.length" class="list-group list-group-flush">
            <div v-for="note in noteStore.recentNotes.slice(0, 3)" :key="note.id" class="list-group-item px-0">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="mb-1">
                    {{ note.title }}
                  </h6>
                  <p class="text-muted small mb-0">
                    {{ truncateText(note.content, 80) }}
                  </p>
                </div>
                <span class="badge bg-light text-muted">{{ formatDate(note.updatedAt) }}</span>
              </div>
            </div>
          </div>
          <p v-else class="text-muted mb-0">
            No notes yet
          </p>
          <template #footer>
            <router-link to="/notes" class="btn btn-sm btn-outline-primary">
              View All Notes
            </router-link>
          </template>
        </AppCard>
      </div>
      
      <!-- Learning Progress -->
      <div class="col-lg-6 mb-4">
        <AppCard title="Learning Progress">
          <div v-if="activeCourse" class="mb-3">
            <div class="d-flex justify-content-between mb-2">
              <span>{{ activeCourse.title }}</span>
              <span class="text-muted">{{ activeCourse.progress }}%</span>
            </div>
            <div class="progress" style="height: 8px;">
              <div class="progress-bar bg-gradient-primary" :style="{ width: activeCourse.progress + '%' }" />
            </div>
          </div>
          <p v-else class="text-muted">
            No active course
          </p>
          <template #footer>
            <router-link to="/learning" class="btn btn-sm btn-outline-primary">
              Continue Learning
            </router-link>
          </template>
        </AppCard>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="row">
      <div class="col-12">
        <h5 class="mb-3">
          Quick Actions
        </h5>
        <div class="d-flex flex-wrap gap-2">
          <AppButton variant="primary" icon="plus-lg" @click="quickAddTask">
            Add Task
          </AppButton>
          <AppButton variant="outline-primary" icon="calendar-plus" @click="quickAddEvent">
            Add Event
          </AppButton>
          <AppButton variant="outline-primary" icon="journal-plus" @click="quickCreateNote">
            Create Note
          </AppButton>
          <AppButton variant="outline-primary" icon="play-circle" @click="continueLearning">
            Continue Learning
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useTaskStore } from '../../stores/taskStore'
import { useCalendarStore } from '../../stores/calendarStore'
import { useNoteStore } from '../../stores/noteStore'
import { useLearningStore } from '../../stores/learningStore'
import AppCard from '../../components/common/AppCard.vue'
import AppButton from '../../components/common/AppButton.vue'
import { formatDate } from '../../utils/date'
import { truncateText } from '../../utils/format'

const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()
const calendarStore = useCalendarStore()
const noteStore = useNoteStore()
const learningStore = useLearningStore()

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const upcomingEvents = computed(() => calendarStore.upcomingEvents)
const activeCourse = computed(() => learningStore.activeCourse)

const quickAddTask = () => {
  router.push('/tasks?action=add')
}

const quickAddEvent = () => {
  router.push('/calendar?action=add')
}

const quickCreateNote = () => {
  router.push('/notes?action=add')
}

const continueLearning = () => {
  router.push('/learning')
}
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  box-shadow: var(--shadow-lg);
}

.stat-card {
  height: 100%;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
</style>
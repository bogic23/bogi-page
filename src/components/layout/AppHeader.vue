<template>
  <header class="app-header">
    <div class="d-flex align-items-center">
      <button class="btn btn-light d-lg-none me-2" @click="toggleMobileSidebar">
        <i class="bi bi-list" />
      </button>
      <h1 class="h4 mb-0">
        {{ pageTitle }}
      </h1>
    </div>
    
    <div class="d-flex align-items-center gap-3">
      <button class="btn btn-light position-relative" @click="toggleNotifications">
        <i class="bi bi-bell" />
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {{ notificationCount }}
        </span>
      </button>
      
      <template v-if="authStore.isAuthenticated">
        <div class="dropdown">
          <button class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
            <i class="bi bi-person-circle me-1" />
            <span class="d-none d-md-inline">{{ authStore.user?.displayName || 'User' }}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <router-link class="dropdown-item" to="/settings">
                <i class="bi bi-gear me-2" />Settings
              </router-link>
            </li>
            <li>
              <router-link class="dropdown-item" to="/portfolio">
                <i class="bi bi-person me-2" />View Portfolio
              </router-link>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <button class="dropdown-item text-danger" @click="logout">
                <i class="bi bi-box-arrow-right me-2" />Logout
              </button>
            </li>
          </ul>
        </div>
      </template>
      
      <template v-else>
        <div class="d-flex gap-2">
          <router-link to="/login" class="btn btn-outline-primary">
            <i class="bi bi-box-arrow-in-right me-1" />
            <span class="d-none d-sm-inline">Login</span>
          </router-link>
          <router-link to="/register" class="btn btn-primary">
            <i class="bi bi-person-plus me-1" />
            <span class="d-none d-sm-inline">Sign Up</span>
          </router-link>
        </div>
      </template>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '../../stores/appStore'
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

const pageTitle = computed(() => {
  const titles = {
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    calendar: 'Calendar',
    notes: 'Notes',
    settings: 'Settings',
    learning: 'Learning Center'
  }
  return titles[route.name] || 'Dashboard'
})

const notificationCount = computed(() => appStore.notifications.length)

const toggleMobileSidebar = () => {
  // Emit event to parent or use app store
  appStore.toggleMobileSidebar()
}

const toggleNotifications = () => {
  appStore.toggleNotifications()
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  background: var(--color-surface);
  padding: var(--spacing-md) var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1020;
}
</style>
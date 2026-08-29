<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': isCollapsed, 'mobile-open': isMobileSidebarOpen }">
    <div class="sidebar-header">
      <router-link to="/dashboard" class="sidebar-brand">
        <i class="bi bi-hexagon-fill text-primary" />
        <span v-if="!isCollapsed" class="ms-2">Bogi Page</span>
      </router-link>
    </div>
    
    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-link-custom" :class="{ active: isActive('dashboard') }">
        <i class="bi bi-house-door" />
        <span v-if="!isCollapsed">Dashboard</span>
      </router-link>
      
      <router-link to="/tasks" class="nav-link-custom" :class="{ active: isActive('tasks') }">
        <i class="bi bi-check2-square" />
        <span v-if="!isCollapsed">Tasks</span>
        <span class="badge bg-primary ms-auto">{{ taskCount }}</span>
      </router-link>
      
      <router-link to="/calendar" class="nav-link-custom" :class="{ active: isActive('calendar') }">
        <i class="bi bi-calendar3" />
        <span v-if="!isCollapsed">Calendar</span>
      </router-link>
      
      <router-link to="/notes" class="nav-link-custom" :class="{ active: isActive('notes') }">
        <i class="bi bi-journal-text" />
        <span v-if="!isCollapsed">Notes</span>
      </router-link>
      
      <router-link to="/learning" class="nav-link-custom" :class="{ active: isActive('learning') }">
        <i class="bi bi-mortarboard" />
        <span v-if="!isCollapsed">Learning</span>
      </router-link>
      
      <div class="sidebar-divider" />
      
      <router-link to="/portfolio" class="nav-link-custom">
        <i class="bi bi-person-badge" />
        <span v-if="!isCollapsed">Portfolio</span>
      </router-link>
      
      <router-link to="/settings" class="nav-link-custom" :class="{ active: isActive('settings') }">
        <i class="bi bi-gear" />
        <span v-if="!isCollapsed">Settings</span>
      </router-link>
    </nav>
    
    <div class="sidebar-footer">
      <button class="btn btn-light btn-sm w-100" @click="toggleSidebar">
        <i :class="isCollapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'" />
        <span v-if="!isCollapsed" class="ms-1">Collapse</span>
      </button>
    </div>
  </aside>
  
  <!-- Mobile overlay -->
  <div v-if="isMobileSidebarOpen" class="sidebar-overlay" @click="closeMobileSidebar" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '../../stores/taskStore'
import { useAppStore } from '../../stores/appStore'

const route = useRoute()
const taskStore = useTaskStore()
const appStore = useAppStore()

const isCollapsed = ref(false)

// Use app store's mobile sidebar state
const isMobileSidebarOpen = computed({
  get: () => appStore.isMobileSidebarOpen,
  set: () => appStore.toggleMobileSidebar()
})

const taskCount = computed(() => taskStore.incompleteTasks.length)

const isActive = (name) => {
  return route.name === name
}

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const closeMobileSidebar = () => {
  appStore.isMobileSidebarOpen = false
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  z-index: 1040;
  transition: width var(--transition-base);
}

.sidebar--collapsed {
  width: 80px;
}

.sidebar-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
}

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-md);
  overflow-y: auto;
}

.nav-link-custom {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-xs);
  border-radius: var(--radius-md);
  color: var(--color-muted);
  text-decoration: none;
  transition: all var(--transition-fast);
  position: relative;
}

.nav-link-custom:hover {
  background: var(--color-background);
  color: var(--color-text);
}

.nav-link-custom.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  box-shadow: var(--shadow-md);
}

.nav-link-custom i {
  font-size: 1.2rem;
  min-width: 24px;
}

.sidebar-divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--spacing-md) 0;
}

.sidebar-footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1030;
}

@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
    width: 250px;
  }
  
  .sidebar--collapsed {
    width: 250px;
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
  }
}
</style>
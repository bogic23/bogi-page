<template>
  <div class="settings-view">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1">
          Settings
        </h2>
        <p class="text-muted mb-0">
          Manage your preferences and account settings
        </p>
      </div>
    </div>
    
    <div class="row">
      <div class="col-lg-3 mb-4">
        <AppCard class="settings-nav">
          <nav class="nav flex-column">
            <button 
              v-for="section in sections" 
              :key="section.id"
              class="nav-link text-start"
              :class="{ active: activeSection === section.id }"
              @click="activeSection = section.id"
            >
              <i :class="`bi bi-${section.icon} me-2`" />
              {{ section.label }}
            </button>
          </nav>
        </AppCard>
      </div>
      
      <div class="col-lg-9">
        <!-- Profile Settings -->
        <AppCard v-if="activeSection === 'profile'" title="Profile Settings">
          <form @submit.prevent="saveProfile">
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Full Name</label>
                <input v-model="profileForm.name" type="text" class="form-control">
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input v-model="profileForm.email" type="email" class="form-control">
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Title</label>
                <input v-model="profileForm.title" type="text" class="form-control">
              </div>
              <div class="col-md-6">
                <label class="form-label">Location</label>
                <input v-model="profileForm.location" type="text" class="form-control">
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Bio</label>
              <textarea v-model="profileForm.bio" class="form-control" rows="4" />
            </div>
            <div class="mb-3">
              <label class="form-label">Avatar</label>
              <div class="d-flex align-items-center gap-3">
                <div class="avatar-preview">
                  <i class="bi bi-person" />
                </div>
                <button type="button" class="btn btn-outline-primary">
                  <i class="bi bi-upload me-1" />Upload Image
                </button>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-check-lg me-1" />Save Changes
            </button>
          </form>
        </AppCard>
        
        <!-- Appearance Settings -->
        <AppCard v-else-if="activeSection === 'appearance'" title="Appearance Settings">
          <div class="mb-4">
            <h6 class="mb-3">
              Theme
            </h6>
            <div class="row">
              <div class="col-md-4 mb-3">
                <div 
                  class="theme-option"
                  :class="{ active: theme === 'light' }"
                  @click="setTheme('light')"
                >
                  <div class="theme-preview theme-preview--light" />
                  <div class="theme-label">
                    Light
                  </div>
                </div>
              </div>
              <div class="col-md-4 mb-3">
                <div 
                  class="theme-option"
                  :class="{ active: theme === 'dark' }"
                  @click="setTheme('dark')"
                >
                  <div class="theme-preview theme-preview--dark" />
                  <div class="theme-label">
                    Dark
                  </div>
                </div>
              </div>
              <div class="col-md-4 mb-3">
                <div 
                  class="theme-option"
                  :class="{ active: theme === 'auto' }"
                  @click="setTheme('auto')"
                >
                  <div class="theme-preview theme-preview--auto" />
                  <div class="theme-label">
                    Auto
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mb-4">
            <h6 class="mb-3">
              Color Scheme
            </h6>
            <div class="d-flex gap-3">
              <button class="btn btn-outline-primary">
                Cyan & Blue
              </button>
              <button class="btn btn-outline-success">
                Green
              </button>
              <button class="btn btn-outline-danger">
                Red
              </button>
              <button class="btn btn-outline-warning">
                Orange
              </button>
            </div>
          </div>
          
          <div>
            <h6 class="mb-3">
              Font Size
            </h6>
            <div class="d-flex align-items-center gap-3">
              <span class="text-muted">Small</span>
              <input
                v-model="fontSize"
                type="range"
                class="form-range"
                min="1"
                max="3"
              >
              <span class="text-muted">Large</span>
            </div>
          </div>
        </AppCard>
        
        <!-- Notification Settings -->
        <AppCard v-else-if="activeSection === 'notifications'" title="Notification Settings">
          <div class="mb-4">
            <h6 class="mb-3">
              Email Notifications
            </h6>
            <div v-for="notification in emailNotifications" :key="notification.id" class="form-check form-switch mb-3">
              <input 
                :id="`email-${notification.id}`" 
                v-model="notification.enabled" 
                type="checkbox" 
                class="form-check-input"
              >
              <label class="form-check-label" :for="`email-${notification.id}`">
                {{ notification.label }}
              </label>
            </div>
          </div>
          
          <div>
            <h6 class="mb-3">
              In-App Notifications
            </h6>
            <div v-for="notification in appNotifications" :key="notification.id" class="form-check form-switch mb-3">
              <input 
                :id="`app-${notification.id}`" 
                v-model="notification.enabled" 
                type="checkbox" 
                class="form-check-input"
              >
              <label class="form-check-label" :for="`app-${notification.id}`">
                {{ notification.label }}
              </label>
            </div>
          </div>
        </AppCard>
        
        <!-- Preferences -->
        <AppCard v-else-if="activeSection === 'preferences'" title="Preferences">
          <div class="mb-4">
            <h6 class="mb-3">
              Dashboard Preferences
            </h6>
            <div class="form-check form-switch mb-3">
              <input
                id="showWelcome"
                v-model="preferences.showWelcome"
                type="checkbox"
                class="form-check-input"
              >
              <label class="form-check-label" for="showWelcome">Show welcome message</label>
            </div>
            <div class="form-check form-switch mb-3">
              <input
                id="showStats"
                v-model="preferences.showStats"
                type="checkbox"
                class="form-check-input"
              >
              <label class="form-check-label" for="showStats">Show statistics cards</label>
            </div>
            <div class="form-check form-switch mb-3">
              <input
                id="showQuickActions"
                v-model="preferences.showQuickActions"
                type="checkbox"
                class="form-check-input"
              >
              <label class="form-check-label" for="showQuickActions">Show quick actions</label>
            </div>
          </div>
          
          <div class="mb-4">
            <h6 class="mb-3">
              Task Defaults
            </h6>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Default Priority</label>
                <select v-model="preferences.defaultPriority" class="form-select">
                  <option value="low">
                    Low
                  </option>
                  <option value="medium">
                    Medium
                  </option>
                  <option value="high">
                    High
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Default Category</label>
                <select v-model="preferences.defaultCategory" class="form-select">
                  <option value="Development">
                    Development
                  </option>
                  <option value="Design">
                    Design
                  </option>
                  <option value="Content">
                    Content
                  </option>
                  <option value="Music">
                    Music
                  </option>
                  <option value="Personal">
                    Personal
                  </option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <h6 class="mb-3">
              Calendar Defaults
            </h6>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Default View</label>
                <select v-model="preferences.defaultCalendarView" class="form-select">
                  <option value="month">
                    Month
                  </option>
                  <option value="week">
                    Week
                  </option>
                  <option value="day">
                    Day
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Week Starts On</label>
                <select v-model="preferences.weekStart" class="form-select">
                  <option value="sunday">
                    Sunday
                  </option>
                  <option value="monday">
                    Monday
                  </option>
                </select>
              </div>
            </div>
          </div>
        </AppCard>
        
        <!-- Danger Zone -->
        <AppCard v-else-if="activeSection === 'danger'" variant="danger" title="Danger Zone">
          <div class="mb-3">
            <h6>Reset Data</h6>
            <p class="text-muted">
              Reset all your data to default values. This action cannot be undone.
            </p>
            <button class="btn btn-outline-danger" @click="resetData">
              <i class="bi bi-arrow-counterclockwise me-1" />Reset All Data
            </button>
          </div>
          <div>
            <h6>Delete Account</h6>
            <p class="text-muted">
              Permanently delete your account and all associated data.
            </p>
            <button class="btn btn-danger" @click="deleteAccount">
              <i class="bi bi-trash me-1" />Delete Account
            </button>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAppStore } from '../../stores/appStore'
import AppCard from '../../components/common/AppCard.vue'

const appStore = useAppStore()

const activeSection = ref('profile')
const theme = ref('light')
const fontSize = ref(2)

const sections = [
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'appearance', label: 'Appearance', icon: 'palette' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'preferences', label: 'Preferences', icon: 'sliders' },
  { id: 'danger', label: 'Danger Zone', icon: 'exclamation-triangle' }
]

const profileForm = reactive({
  name: 'Bogi',
  email: 'bogi@example.com',
  title: 'Full Stack Developer & Music Educator',
  location: 'Remote',
  bio: 'Passionate developer with a focus on creating intuitive user experiences and educational technology.'
})

const emailNotifications = ref([
  { id: 1, label: 'Task reminders', enabled: true },
  { id: 2, label: 'Calendar event reminders', enabled: true },
  { id: 3, label: 'Course updates', enabled: false },
  { id: 4, label: 'Weekly summary', enabled: true }
])

const appNotifications = ref([
  { id: 1, label: 'Task completed', enabled: true },
  { id: 2, label: 'New achievement', enabled: true },
  { id: 3, label: 'Course progress', enabled: true },
  { id: 4, label: 'System updates', enabled: false }
])

const preferences = reactive({
  showWelcome: true,
  showStats: true,
  showQuickActions: true,
  defaultPriority: 'medium',
  defaultCategory: 'Development',
  defaultCalendarView: 'month',
  weekStart: 'sunday'
})

const setTheme = (newTheme) => {
  theme.value = newTheme
  appStore.setTheme(newTheme)
  appStore.addNotification({
    title: 'Theme Updated',
    message: `Theme has been changed to ${newTheme} mode`
  })
}

const saveProfile = () => {
  appStore.addNotification({
    title: 'Profile Updated',
    message: 'Your profile has been updated successfully'
  })
}

const resetData = () => {
  if (confirm('Are you sure you want to reset all data?')) {
    appStore.addNotification({
      title: 'Data Reset',
      message: 'All data has been reset to default values'
    })
  }
}

const deleteAccount = () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    appStore.addNotification({
      title: 'Account Deleted',
      message: 'Your account has been scheduled for deletion'
    })
  }
}
</script>

<style scoped>
.settings-nav .nav-link {
  color: var(--color-text);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.settings-nav .nav-link:hover {
  background: var(--color-background);
}

.settings-nav .nav-link.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--color-primary);
}

.theme-option {
  cursor: pointer;
  text-align: center;
  padding: var(--spacing-sm);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.theme-option:hover {
  border-color: var(--color-primary);
}

.theme-option.active {
  border-color: var(--color-primary);
}

.theme-preview {
  height: 100px;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
}

.theme-preview--light {
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
}

.theme-preview--dark {
  background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
}

.theme-preview--auto {
  background: linear-gradient(135deg, #ffffff 0%, #1a1a1a 100%);
}
</style>
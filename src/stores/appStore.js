import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const isMobileSidebarOpen = ref(false)
  const isNotificationsOpen = ref(false)
  const theme = ref('light')
  const notifications = ref([
    { id: 1, title: 'Welcome to Bogi Page', message: 'Your personal dashboard is ready', time: 'Now' },
    { id: 2, title: 'New course available', message: 'Music Production Basics is now live', time: '2h ago' },
    { id: 3, title: 'Task due soon', message: 'Complete project documentation', time: '5h ago' }
  ])
  
  // Actions
  const initializeApp = () => {
    // Initialize app state
    console.log('App initialized')
  }
  
  const toggleMobileSidebar = () => {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
  }
  
  const toggleNotifications = () => {
    isNotificationsOpen.value = !isNotificationsOpen.value
  }
  
  const setTheme = (newTheme) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
  }
  
  const addNotification = (notification) => {
    notifications.value.unshift({
      id: Date.now(),
      time: 'Now',
      ...notification
    })
  }
  
  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }
  
  return {
    // State
    isMobileSidebarOpen,
    isNotificationsOpen,
    theme,
    notifications,
    // Actions
    initializeApp,
    toggleMobileSidebar,
    toggleNotifications,
    setTheme,
    addNotification,
    removeNotification
  }
})
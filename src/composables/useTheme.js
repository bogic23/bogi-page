import { ref, watch } from 'vue'
import { useAppStore } from '../stores/appStore'

export function useTheme() {
  const appStore = useAppStore()
  const theme = ref(appStore.theme || 'light')
  
  const applyTheme = (newTheme) => {
    theme.value = newTheme
    appStore.setTheme(newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
      document.body.classList.add('dark-theme')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      document.body.classList.remove('dark-theme')
    }
  }
  
  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(newTheme)
  }
  
  // Watch for system theme changes if set to auto
  watch(() => appStore.theme, (newTheme) => {
    if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(prefersDark ? 'dark' : 'light')
    } else {
      applyTheme(newTheme)
    }
  })
  
  return {
    theme,
    applyTheme,
    toggleTheme
  }
}
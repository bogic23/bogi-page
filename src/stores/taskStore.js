import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import { useAuthStore } from './authStore'
import { toDate } from '@/utils/dateUtils'

const LOCAL_STORAGE_KEY = 'bogi_tasks_guest'

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveToLocalStorage = (tasks) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks))
  } catch (err) {
    console.error('Failed to save tasks to localStorage:', err)
  }
}

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)
  let unsubscribe = null
  const filters = ref({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'dueDate'
  })

  // Initialize listener
  const initListener = () => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated || unsubscribe) {
      if (!authStore.isAuthenticated) {
        // Load from localStorage for guest users
        tasks.value = loadFromLocalStorage()
      }
      loading.value = false
      return
    }

    loading.value = true
    const userId = authStore.user?.uid
    if (!userId) {
      loading.value = false
      return
    }

    const tasksQuery = query(
      collection(db, 'users', userId, 'tasks'),
      orderBy('createdAt', 'desc')
    )

    unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      tasks.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      loading.value = false
    }, (err) => {
      error.value = err.message
      loading.value = false
    })
  }

  // Watch for auth changes and auto-initialize
  watch(() => useAuthStore().isAuthenticated, async (isAuthenticated) => {
    if (isAuthenticated && !unsubscribe) {
      // Sync localStorage data to Firestore before initializing listener
      await syncLocalStorageToFirestore()
      initListener()
    } else if (!isAuthenticated) {
      cleanupListener()
      // Load from localStorage for guest users
      tasks.value = loadFromLocalStorage()
    }
  }, { immediate: true })

  // Cleanup listener
  const cleanupListener = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    tasks.value = []
  }

  // Sync localStorage data to Firestore
  const syncLocalStorageToFirestore = async () => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return

    const localTasks = loadFromLocalStorage()
    if (localTasks.length === 0) return

    const userId = authStore.user?.uid
    if (!userId) return

    try {
      for (const task of localTasks) {
        const newTask = {
          ...task,
          completed: task.completed || false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          userId,
          syncedFromLocalStorage: true
        }
        await addDoc(collection(db, 'users', userId, 'tasks'), newTask)
      }
      // Clear localStorage after successful sync
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    } catch (err) {
      console.error('Failed to sync tasks to Firestore:', err)
    }
  }

  // Getters
  const incompleteTasks = computed(() => tasks.value.filter(t => !t.completed))
  const completedTasks = computed(() => tasks.value.filter(t => t.completed))

  const filteredTasks = computed(() => {
    let filtered = [...tasks.value]

    // Search
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase()
      filtered = filtered.filter(task =>
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      )
    }

    // Status filter
    if (filters.value.status === 'active') {
      filtered = filtered.filter(t => !t.completed)
    } else if (filters.value.status === 'completed') {
      filtered = filtered.filter(t => t.completed)
    }

    // Priority filter
    if (filters.value.priority !== 'all') {
      filtered = filtered.filter(t => t.priority === filters.value.priority)
    }

    // Category filter
    if (filters.value.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.value.category)
    }

    // Sorting
    const sortBy = filters.value.sortBy
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate': {
          const aDate = toDate(a.dueDate)?.getTime() || 0
          const bDate = toDate(b.dueDate)?.getTime() || 0
          return aDate - bDate
        }
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        case 'title':
          return (a.title || '').localeCompare(b.title || '')
        case 'createdAt': {
          const aDate = toDate(a.createdAt)?.getTime() || 0
          const bDate = toDate(b.createdAt)?.getTime() || 0
          return bDate - aDate
        }
        default:
          return 0
      }
    })

    return filtered
  })

  const categories = computed(() => {
    const cats = new Set(tasks.value.map(t => t.category).filter(Boolean))
    return Array.from(cats)
  })

  // Actions
  const addTask = async (task) => {
    const authStore = useAuthStore()
    error.value = null

    // Wait for auth to be ready if still loading
    if (authStore.loading) {
      await authStore.initAuth()
    }

    const newTask = {
      ...task,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (authStore.isAuthenticated) {
      const userId = authStore.user?.uid
      if (!userId) throw new Error('Not authenticated')

      try {
        const firestoreTask = {
          ...newTask,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          userId
        }
        const docRef = await addDoc(collection(db, 'users', userId, 'tasks'), firestoreTask)
        return { id: docRef.id, ...firestoreTask }
      } catch (err) {
        error.value = err.message
        throw err
      }
    } else {
      // Guest user - save to localStorage
      const tempId = 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      const taskWithId = { ...newTask, id: tempId }
      tasks.value.unshift(taskWithId)
      saveToLocalStorage(tasks.value)
      return taskWithId
    }
  }

  const updateTask = async (id, updates) => {
    const authStore = useAuthStore()
    error.value = null

    // Wait for auth to be ready if still loading
    if (authStore.loading) {
      await authStore.initAuth()
    }

    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    }

    if (authStore.isAuthenticated) {
      const userId = authStore.user?.uid
      if (!userId) throw new Error('Not authenticated')

      try {
        await updateDoc(doc(db, 'users', userId, 'tasks', id), {
          ...updates,
          updatedAt: serverTimestamp()
        })
        // Update local state
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tasks.value[index] = { ...tasks.value[index], ...updatedData }
        }
      } catch (err) {
        error.value = err.message
        throw err
      }
    } else {
      // Guest user - update localStorage
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = { ...tasks.value[index], ...updatedData }
        saveToLocalStorage(tasks.value)
      }
    }
  }

  const deleteTask = async (id) => {
    const authStore = useAuthStore()
    error.value = null

    // Wait for auth to be ready if still loading
    if (authStore.loading) {
      await authStore.initAuth()
    }

    if (authStore.isAuthenticated) {
      const userId = authStore.user?.uid
      if (!userId) throw new Error('Not authenticated')

      try {
        await deleteDoc(doc(db, 'users', userId, 'tasks', id))
        tasks.value = tasks.value.filter(t => t.id !== id)
      } catch (err) {
        error.value = err.message
        throw err
      }
    } else {
      // Guest user - delete from localStorage
      tasks.value = tasks.value.filter(t => t.id !== id)
      saveToLocalStorage(tasks.value)
    }
  }

  const toggleTaskComplete = async (id) => {
    const authStore = useAuthStore()
    error.value = null

    // Wait for auth to be ready if still loading
    if (authStore.loading) {
      await authStore.initAuth()
    }

    const task = tasks.value.find(t => t.id === id)
    if (task) {
      await updateTask(id, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      })
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  return {
    // State
    tasks,
    loading,
    error,
    filters,
    // Getters
    incompleteTasks,
    completedTasks,
    filteredTasks,
    categories,
    // Actions
    initListener,
    cleanupListener,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    setFilters,
    syncLocalStorageToFirestore
  }
})
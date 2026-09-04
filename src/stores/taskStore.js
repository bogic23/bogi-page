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

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)
  const unsubscribe = ref(null)
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
    if (!authStore.isAuthenticated || unsubscribe.value) {
      loading.value = false
      return
    }

    loading.value = true
    const userId = authStore.user.value?.uid
    if (!userId) return

    const tasksQuery = query(
      collection(db, 'users', userId, 'tasks'),
      orderBy('createdAt', 'desc')
    )

    unsubscribe.value = onSnapshot(tasksQuery, (snapshot) => {
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
  watch(() => useAuthStore().isAuthenticated, (isAuthenticated) => {
    if (isAuthenticated && !unsubscribe.value) {
      initListener()
    } else if (!isAuthenticated) {
      cleanupListener()
    }
  })

  // Cleanup listener
  const cleanupListener = () => {
    if (unsubscribe.value) {
      unsubscribe.value()
      unsubscribe.value = null
    }
    tasks.value = []
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
        task.title.toLowerCase().includes(searchLower) ||
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
        case 'dueDate':
          return new Date(a.dueDate || 0) - new Date(b.dueDate || 0)
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        case 'title':
          return a.title.localeCompare(b.title)
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt)
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
    const userId = authStore.user.value?.uid
    if (!userId) throw new Error('Not authenticated')

    try {
      const newTask = {
        ...task,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId
      }
      const docRef = await addDoc(collection(db, 'users', userId, 'tasks'), newTask)
      return { id: docRef.id, ...newTask }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const updateTask = async (id, updates) => {
    const authStore = useAuthStore()
    const userId = authStore.user.value?.uid
    if (!userId) throw new Error('Not authenticated')

    try {
      await updateDoc(doc(db, 'users', userId, 'tasks', id), {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteTask = async (id) => {
    const authStore = useAuthStore()
    const userId = authStore.user.value?.uid
    if (!userId) throw new Error('Not authenticated')

    try {
      await deleteDoc(doc(db, 'users', userId, 'tasks', id))
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const toggleTaskComplete = async (id) => {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      await updateTask(id, {
        completed: !task.completed,
        completedAt: !task.completed ? serverTimestamp() : null
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
    setFilters
  }
})
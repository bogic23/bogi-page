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

export const useCalendarStore = defineStore('calendar', () => {
  // State
  const events = ref([])
  const loading = ref(false)
  const error = ref(null)
  const unsubscribe = ref(null)
  const currentDate = ref(new Date())
  const selectedDate = ref(new Date())
  const viewMode = ref('month') // 'month', 'week', 'day'

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

    const eventsQuery = query(
      collection(db, 'users', userId, 'events'),
      orderBy('start', 'asc')
    )

    unsubscribe.value = onSnapshot(eventsQuery, (snapshot) => {
      events.value = snapshot.docs.map(doc => ({
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
    events.value = []
  }

  // Getters
  const upcomingEvents = computed(() => {
    const now = new Date()
    return events.value
      .filter(event => new Date(event.start) >= now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 5)
  })

  const eventsForSelectedDate = computed(() => {
    const selected = selectedDate.value
    return events.value.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === selected.toDateString()
    })
  })

  const currentMonthEvents = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    return events.value.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate.getFullYear() === year && eventDate.getMonth() === month
    })
  })

  // Actions
  const addEvent = async (event) => {
    const authStore = useAuthStore()
    
    // Wait for auth to be ready if still loading
    if (authStore.loading) {
      await authStore.initAuth()
    }
    
    const userId = authStore.user.value?.uid
    if (!userId) throw new Error('Not authenticated')

    try {
      const newEvent = {
        ...event,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId
      }
      const docRef = await addDoc(collection(db, 'users', userId, 'events'), newEvent)
      return { id: docRef.id, ...newEvent }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const updateEvent = async (id, updates) => {
    const authStore = useAuthStore()
    
    // Wait for auth to be ready if still loading
    if (authStore.loading) {
      await authStore.initAuth()
    }
    
    const userId = authStore.user.value?.uid
    if (!userId) throw new Error('Not authenticated')

    try {
      await updateDoc(doc(db, 'users', userId, 'events', id), {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteEvent = async (id) => {
    const authStore = useAuthStore()
    
    // Wait for auth to be ready if still loading
    if (authStore.loading) {
      await authStore.initAuth()
    }
    
    const userId = authStore.user.value?.uid
    if (!userId) throw new Error('Not authenticated')

    try {
      await deleteDoc(doc(db, 'users', userId, 'events', id))
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const setSelectedDate = (date) => {
    selectedDate.value = new Date(date)
  }

  const setCurrentDate = (date) => {
    currentDate.value = new Date(date)
  }

  const nextMonth = () => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      1
    )
  }

  const previousMonth = () => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1
    )
  }

  const getEventsByCategory = (category) => {
    return events.value.filter(event => event.category === category)
  }

  return {
    // State
    events,
    loading,
    error,
    currentDate,
    selectedDate,
    viewMode,
    // Getters
    upcomingEvents,
    eventsForSelectedDate,
    currentMonthEvents,
    // Actions
    initListener,
    cleanupListener,
    addEvent,
    updateEvent,
    deleteEvent,
    setSelectedDate,
    setCurrentDate,
    nextMonth,
    previousMonth,
    getEventsByCategory
  }
})
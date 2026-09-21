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

const LOCAL_STORAGE_KEY = 'bogi_events_guest'

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveToLocalStorage = (events) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events))
  } catch (err) {
    console.error('Failed to save events to localStorage:', err)
  }
}

export const useCalendarStore = defineStore('calendar', () => {
  // State
  const events = ref([])
  const loading = ref(false)
  const error = ref(null)
  let unsubscribe = null
  const currentDate = ref(new Date())
  const selectedDate = ref(new Date())
  const viewMode = ref('month') // 'month', 'week', 'day'

  // Initialize listener
  const initListener = () => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated || unsubscribe) {
      if (!authStore.isAuthenticated) {
        // Load from localStorage for guest users
        events.value = loadFromLocalStorage()
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

    const eventsQuery = query(
      collection(db, 'users', userId, 'events'),
      orderBy('start', 'asc')
    )

    unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
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
  watch(() => useAuthStore().isAuthenticated, async (isAuthenticated) => {
    if (isAuthenticated && !unsubscribe) {
      // Sync localStorage data to Firestore before initializing listener
      await syncLocalStorageToFirestore()
      initListener()
    } else if (!isAuthenticated) {
      cleanupListener()
      // Load from localStorage for guest users
      events.value = loadFromLocalStorage()
    }
  }, { immediate: true })

  // Cleanup listener
  const cleanupListener = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    events.value = []
  }

  // Sync localStorage data to Firestore
  const syncLocalStorageToFirestore = async () => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return

    const localEvents = loadFromLocalStorage()
    if (localEvents.length === 0) return

    const userId = authStore.user?.uid
    if (!userId) return

    try {
      for (const event of localEvents) {
        const newEvent = {
          ...event,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          userId,
          syncedFromLocalStorage: true
        }
        await addDoc(collection(db, 'users', userId, 'events'), newEvent)
      }
      // Clear localStorage after successful sync
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    } catch (err) {
      console.error('Failed to sync events to Firestore:', err)
    }
  }

  // Getters
  const upcomingEvents = computed(() => {
    const now = new Date()
    return events.value
      .filter(event => toDate(event.start)?.getTime() >= now.getTime())
      .sort((a, b) => toDate(a.start)?.getTime() - toDate(b.start)?.getTime())
      .slice(0, 5)
  })

  const eventsForSelectedDate = computed(() => {
    const selected = selectedDate.value
    return events.value.filter(event => {
      const eventDate = toDate(event.start)
      return eventDate?.toDateString() === selected.toDateString()
    })
  })

  const currentMonthEvents = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    return events.value.filter(event => {
      const eventDate = toDate(event.start)
      return eventDate?.getFullYear() === year && eventDate?.getMonth() === month
    })
  })

  // Actions
  const addEvent = async (event) => {
    const authStore = useAuthStore()
    error.value = null

    // Wait for auth to be ready if still loading
    if (authStore.loading) {
      await authStore.initAuth()
    }

    const newEvent = {
      ...event,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (authStore.isAuthenticated) {
      const userId = authStore.user?.uid
      if (!userId) throw new Error('Not authenticated')

      try {
        const firestoreEvent = {
          ...newEvent,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          userId
        }
        const docRef = await addDoc(collection(db, 'users', userId, 'events'), firestoreEvent)
        return { id: docRef.id, ...firestoreEvent }
      } catch (err) {
        error.value = err.message
        throw err
      }
    } else {
      // Guest user - save to localStorage
      const tempId = 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      const eventWithId = { ...newEvent, id: tempId }
      events.value.push(eventWithId)
      saveToLocalStorage(events.value)
      return eventWithId
    }
  }

  const updateEvent = async (id, updates) => {
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
        await updateDoc(doc(db, 'users', userId, 'events', id), {
          ...updates,
          updatedAt: serverTimestamp()
        })
        // Update local state
        const index = events.value.findIndex(e => e.id === id)
        if (index !== -1) {
          events.value[index] = { ...events.value[index], ...updatedData }
        }
      } catch (err) {
        error.value = err.message
        throw err
      }
    } else {
      // Guest user - update localStorage
      const index = events.value.findIndex(e => e.id === id)
      if (index !== -1) {
        events.value[index] = { ...events.value[index], ...updatedData }
        saveToLocalStorage(events.value)
      }
    }
  }

  const deleteEvent = async (id) => {
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
        await deleteDoc(doc(db, 'users', userId, 'events', id))
        events.value = events.value.filter(e => e.id !== id)
      } catch (err) {
        error.value = err.message
        throw err
      }
    } else {
      // Guest user - delete from localStorage
      events.value = events.value.filter(e => e.id !== id)
      saveToLocalStorage(events.value)
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
    getEventsByCategory,
    syncLocalStorageToFirestore
  }
})
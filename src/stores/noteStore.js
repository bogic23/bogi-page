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

export const useNoteStore = defineStore('notes', () => {
  // State
  const notes = ref([])
  const loading = ref(false)
  const error = ref(null)
  const unsubscribe = ref(null)
  const filters = ref({
    search: '',
    category: 'all',
    tag: 'all',
    sortBy: 'updatedAt'
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

    const notesQuery = query(
      collection(db, 'users', userId, 'notes'),
      orderBy('updatedAt', 'desc')
    )

    unsubscribe.value = onSnapshot(notesQuery, (snapshot) => {
      notes.value = snapshot.docs.map(doc => ({
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
    notes.value = []
  }

  // Getters
  const pinnedNotes = computed(() =>
    notes.value.filter(note => note.pinned)
  )

  const recentNotes = computed(() => {
    return [...notes.value]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
  })

  const allCategories = computed(() => {
    const categories = new Set(notes.value.map(note => note.category).filter(Boolean))
    return Array.from(categories)
  })

  const allTags = computed(() => {
    const tags = new Set()
    notes.value.forEach(note => {
      note.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  })

  const filteredNotes = computed(() => {
    let filtered = [...notes.value]

    // Search
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase()
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Category filter
    if (filters.value.category !== 'all') {
      filtered = filtered.filter(note => note.category === filters.value.category)
    }

    // Tag filter
    if (filters.value.tag !== 'all') {
      filtered = filtered.filter(note => note.tags?.includes(filters.value.tag))
    }

    // Sorting
    const sortBy = filters.value.sortBy
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updatedAt':
          return new Date(b.updatedAt) - new Date(a.updatedAt)
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'title':
          return a.title.localeCompare(b.title)
        case 'category':
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

    return filtered
  })

  // Actions
  const addNote = async (note) => {
    const authStore = useAuthStore()
    
    // Wait for auth to be ready if still loading
    if (authStore.loading) {
      await authStore.initAuth()
    }
    
    const userId = authStore.user.value?.uid
    if (!userId) throw new Error('Not authenticated')

    try {
      const newNote = {
        ...note,
        pinned: false,
        tags: note.tags || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId
      }
      const docRef = await addDoc(collection(db, 'users', userId, 'notes'), newNote)
      return { id: docRef.id, ...newNote }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const updateNote = async (id, updates) => {
    const authStore = useAuthStore()
    
    // Wait for auth to be ready if still loading
    if (authStore.loading) {
      await authStore.initAuth()
    }
    
    const userId = authStore.user.value?.uid
    if (!userId) throw new Error('Not authenticated')

    try {
      await updateDoc(doc(db, 'users', userId, 'notes', id), {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteNote = async (id) => {
    const authStore = useAuthStore()
    
    // Wait for auth to be ready if still loading
    if (authStore.loading) {
      await authStore.initAuth()
    }
    
    const userId = authStore.user.value?.uid
    if (!userId) throw new Error('Not authenticated')

    try {
      await deleteDoc(doc(db, 'users', userId, 'notes', id))
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const togglePin = async (id) => {
    const authStore = useAuthStore()
    
    // Wait for auth to be ready if still loading
    if (authStore.loading) {
      await authStore.initAuth()
    }
    
    const note = notes.value.find(n => n.id === id)
    if (note) {
      await updateNote(id, { pinned: !note.pinned })
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const getNoteById = (id) => {
    return notes.value.find(n => n.id === id)
  }

  return {
    // State
    notes,
    loading,
    error,
    filters,
    // Getters
    pinnedNotes,
    recentNotes,
    allCategories,
    allTags,
    filteredNotes,
    // Actions
    initListener,
    cleanupListener,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    setFilters,
    getNoteById
  }
})
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notes as mockNotes } from '../data/notes'

export const useNoteStore = defineStore('notes', () => {
  // State
  const notes = ref([...mockNotes])
  const filters = ref({
    search: '',
    category: 'all',
    tag: 'all',
    sortBy: 'updatedAt'
  })
  
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
    const categories = new Set(notes.value.map(note => note.category))
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
  const addNote = (note) => {
    const newNote = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
      tags: [],
      ...note
    }
    notes.value.unshift(newNote)
    return newNote
  }
  
  const updateNote = (id, updates) => {
    const index = notes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  }
  
  const deleteNote = (id) => {
    notes.value = notes.value.filter(n => n.id !== id)
  }
  
  const togglePin = (id) => {
    const note = notes.value.find(n => n.id === id)
    if (note) {
      note.pinned = !note.pinned
      note.updatedAt = new Date().toISOString()
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
    filters,
    // Getters
    pinnedNotes,
    recentNotes,
    allCategories,
    allTags,
    filteredNotes,
    // Actions
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    setFilters,
    getNoteById
  }
})
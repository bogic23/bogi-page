import { computed } from 'vue'
import { useNoteStore } from '../stores/noteStore'

export function useNotes() {
  const noteStore = useNoteStore()
  
  const notesByCategory = computed(() => {
    const grouped = {}
    noteStore.allCategories.forEach(category => {
      grouped[category] = noteStore.notes.filter(note => note.category === category)
    })
    return grouped
  })
  
  const notesByTag = computed(() => {
    const grouped = {}
    noteStore.allTags.forEach(tag => {
      grouped[tag] = noteStore.notes.filter(note => note.tags?.includes(tag))
    })
    return grouped
  })
  
  const searchNotes = (query) => {
    const searchLower = query.toLowerCase()
    return noteStore.notes.filter(note =>
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      note.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }
  
  return {
    notesByCategory,
    notesByTag,
    searchNotes
  }
}
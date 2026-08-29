import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { events as mockEvents } from '../data/events'

export const useCalendarStore = defineStore('calendar', () => {
  // State
  const events = ref([...mockEvents])
  const currentDate = ref(new Date())
  const selectedDate = ref(new Date())
  const viewMode = ref('month') // 'month', 'week', 'day'
  
  // Getters
  const upcomingEvents = computed(() => {
    const now = new Date()
    return events.value
      .filter(event => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5)
  })
  
  const eventsForSelectedDate = computed(() => {
    const selected = selectedDate.value
    return events.value.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === selected.toDateString()
    })
  })
  
  const currentMonthEvents = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    return events.value.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getFullYear() === year && eventDate.getMonth() === month
    })
  })
  
  // Actions
  const addEvent = (event) => {
    const newEvent = {
      id: Date.now(),
      ...event
    }
    events.value.push(newEvent)
    return newEvent
  }
  
  const updateEvent = (id, updates) => {
    const index = events.value.findIndex(e => e.id === id)
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...updates }
    }
  }
  
  const deleteEvent = (id) => {
    events.value = events.value.filter(e => e.id !== id)
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
    currentDate,
    selectedDate,
    viewMode,
    // Getters
    upcomingEvents,
    eventsForSelectedDate,
    currentMonthEvents,
    // Actions
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
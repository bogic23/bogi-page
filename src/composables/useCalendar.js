import { computed } from 'vue'
import { useCalendarStore } from '../stores/calendarStore'

export function useCalendar() {
  const calendarStore = useCalendarStore()
  
  const todayEvents = computed(() => {
    const today = new Date()
    return calendarStore.events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === today.toDateString()
    })
  })
  
  const weekEvents = computed(() => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)
    
    return calendarStore.events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= weekStart && eventDate < weekEnd
    })
  })
  
  const getEventsBetweenDates = (startDate, endDate) => {
    return calendarStore.events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= startDate && eventDate <= endDate
    })
  }
  
  return {
    todayEvents,
    weekEvents,
    getEventsBetweenDates
  }
}
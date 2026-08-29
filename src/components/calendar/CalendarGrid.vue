<template>
  <div class="calendar-grid">
    <!-- Calendar Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="mb-0">
          {{ currentMonthName }} {{ currentYear }}
        </h4>
      </div>
      <div class="btn-group">
        <button class="btn btn-light" @click="calendarStore.previousMonth()">
          <i class="bi bi-chevron-left" />
        </button>
        <button class="btn btn-light" @click="goToToday">
          Today
        </button>
        <button class="btn btn-light" @click="calendarStore.nextMonth()">
          <i class="bi bi-chevron-right" />
        </button>
      </div>
    </div>
    
    <!-- Calendar Grid Container -->
    <div class="calendar-grid-container">
      <!-- Days of Week Header -->
      <div class="calendar-week-row calendar-header">
        <div 
          v-for="day in daysOfWeek" 
          :key="day" 
          class="calendar-week-day"
        >
          {{ day }}
        </div>
      </div>
      
      <!-- Calendar Weeks -->
      <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="calendar-week-row">
        <div 
          v-for="(day, dayIndex) in week" 
          :key="dayIndex"
          class="calendar-week-day calendar-day"
          :class="{
            'calendar-day--empty': !day,
            'calendar-day--selected': day && isSelected(day),
            'calendar-day--today': day && isToday(day)
          }"
          @click="day && selectDate(day)"
        >
          <div v-if="day" class="calendar-day-content">
            <span class="day-number">{{ day.getDate() }}</span>
            <div class="day-events">
              <div 
                v-for="event in getEventsForDay(day)" 
                :key="event.id"
                class="event-indicator"
                :class="`event-indicator--${event.category}`"
                @click.stop="showEventDetails(event)"
              >
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '../../stores/calendarStore'

const calendarStore = useCalendarStore()
const emit = defineEmits(['select-date', 'show-event'])

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthName = computed(() => {
  return calendarStore.currentDate.toLocaleDateString('en-US', { month: 'long' })
})

const currentYear = computed(() => {
  return calendarStore.currentDate.getFullYear()
})

const weeks = computed(() => {
  const year = calendarStore.currentDate.getFullYear()
  const month = calendarStore.currentDate.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const weeks = []
  let currentWeek = []
  
  // Add empty days for start of month
  for (let i = 0; i < firstDay.getDay(); i++) {
    currentWeek.push(null)
  }
  
  // Add days of month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    currentWeek.push(new Date(year, month, day))
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }
  
  // Add empty days to complete the last week
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push(null)
  }
  
  if (currentWeek.length === 7) {
    weeks.push(currentWeek)
  }
  
  // Ensure at least 6 weeks for consistent height
  while (weeks.length < 6) {
    weeks.push([null, null, null, null, null, null, null])
  }
  
  return weeks
})

const getEventsForDay = (day) => {
  return calendarStore.events.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate.toDateString() === day.toDateString()
  })
}

const isSelected = (day) => {
  return day.toDateString() === calendarStore.selectedDate.toDateString()
}

const isToday = (day) => {
  const today = new Date()
  return day.toDateString() === today.toDateString()
}

const selectDate = (day) => {
  calendarStore.setSelectedDate(day)
  emit('select-date', day)
}

const goToToday = () => {
  calendarStore.setCurrentDate(new Date())
  calendarStore.setSelectedDate(new Date())
}

const showEventDetails = (event) => {
  emit('show-event', event)
}
</script>

<style scoped>
.calendar-grid-container {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface);
}

.calendar-week-row {
  display: flex;
  border-bottom: 1px solid var(--color-border);
}

.calendar-week-row:last-child {
  border-bottom: none;
}

.calendar-header {
  background: var(--color-background);
  border-bottom: 2px solid var(--color-border);
}

.calendar-header .calendar-week-day {
  font-weight: 600;
  color: var(--color-muted);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: var(--spacing-sm) var(--spacing-xs);
}

.calendar-week-day {
  flex: 1;
  min-height: 100px;
  border-right: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  display: flex;
  flex-direction: column;
}

.calendar-week-day:last-child {
  border-right: none;
}

.calendar-week-day:hover:not(.calendar-day--empty) {
  background: var(--color-background);
}

.calendar-day--empty {
  background: var(--color-background);
  cursor: default;
}

.calendar-day--selected {
  background: rgba(14, 165, 233, 0.1);
  border-color: var(--color-primary);
}

.calendar-day--selected .day-number {
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.calendar-day--today .day-number {
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.calendar-day-content {
  padding: var(--spacing-sm);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.day-number {
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  display: inline-block;
  align-self: flex-start;
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: auto;
}

.event-indicator {
  font-size: 0.7rem;
  padding: 2px 4px;
  border-radius: 3px;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-indicator--meeting {
  background: var(--color-primary);
}

.event-indicator--deadline {
  background: var(--color-danger);
}

.event-indicator--learning {
  background: var(--color-success);
}

.event-indicator--personal {
  background: var(--color-warning);
}

.event-indicator--work {
  background: var(--color-secondary);
}

@media (max-width: 768px) {
  .calendar-week-day {
    min-height: 80px;
    padding: var(--spacing-xs);
  }
  
  .day-number {
    font-size: 0.875rem;
  }
  
  .event-indicator {
    font-size: 0.65rem;
    padding: 1px 3px;
  }
}
</style>
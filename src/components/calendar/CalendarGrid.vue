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
    
    <!-- Days of Week -->
    <div class="row g-0 mb-2">
      <div v-for="day in daysOfWeek" :key="day" class="col text-center fw-bold text-muted py-2">
        {{ day }}
      </div>
    </div>
    
    <!-- Calendar Days -->
    <div class="row g-0">
      <div 
        v-for="(day, index) in calendarDays" 
        :key="index"
        class="col calendar-day"
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

const calendarDays = computed(() => {
  const year = calendarStore.currentDate.getFullYear()
  const month = calendarStore.currentDate.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const days = []
  
  // Add empty days for start of month
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null)
  }
  
  // Add days of month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day))
  }
  
  // Add empty days to complete the last week
  while (days.length % 7 !== 0) {
    days.push(null)
  }
  
  return days
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
.calendar-day {
  min-height: 100px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

.calendar-day:hover {
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
}

.day-number {
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  display: inline-block;
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
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
</style>
<template>
  <div class="calendar-view">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1">
          Calendar
        </h2>
        <p class="text-muted mb-0">
          Manage your schedule and events
        </p>
      </div>
      <AppButton variant="primary" icon="plus-lg" @click="openCreateModal">
        Add Event
      </AppButton>
    </div>
    
    <div class="row">
      <!-- Calendar Grid -->
      <div class="col-lg-8 mb-4">
        <AppCard>
          <CalendarGrid 
            @select-date="handleDateSelect"
            @show-event="showEventDetails"
          />
        </AppCard>
      </div>
      
      <!-- Event List for Selected Date -->
      <div class="col-lg-4 mb-4">
        <AppCard>
          <template #header>
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                Events for {{ formatSelectedDate }}
              </h5>
              <button class="btn btn-sm btn-light" @click="openCreateModal">
                <i class="bi bi-plus-lg" />
              </button>
            </div>
          </template>
          <EventList 
            :events="calendarStore.eventsForSelectedDate"
            @edit="openEditModal"
            @delete="handleDeleteEvent"
          />
        </AppCard>
        
        <!-- Upcoming Events -->
        <AppCard title="Upcoming Events" class="mt-4">
          <div v-if="calendarStore.upcomingEvents.length">
            <div v-for="event in calendarStore.upcomingEvents" :key="event.id" class="upcoming-event mb-3">
              <div class="d-flex align-items-start">
                <div class="event-date-badge">
                  <span class="day">{{ getEventDay(event.date) }}</span>
                  <span class="month">{{ getEventMonth(event.date) }}</span>
                </div>
                <div class="ms-3">
                  <h6 class="mb-1">
                    {{ event.title }}
                  </h6>
                  <small class="text-muted">
                    <i class="bi bi-clock me-1" />
                    {{ formatEventTime(event.date) }}
                  </small>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-muted mb-0">
            No upcoming events
          </p>
        </AppCard>
      </div>
    </div>
    
    <!-- Event Modal -->
    <AppModal 
      v-model="showModal" 
      :title="editingEvent ? 'Edit Event' : 'Create New Event'"
      size="lg"
    >
      <EventForm 
        :event="editingEvent"
        @submit="handleEventSubmit"
        @cancel="closeModal"
      />
    </AppModal>
    
    <!-- Event Details Modal -->
    <AppModal 
      v-model="showDetailsModal" 
      :title="selectedEvent?.title || 'Event Details'"
    >
      <div v-if="selectedEvent">
        <p class="text-muted">
          {{ selectedEvent.description }}
        </p>
        <div class="mb-2">
          <strong><i class="bi bi-clock me-2" />Time:</strong>
          <span>{{ formatEventTime(selectedEvent.date) }}</span>
          <template v-if="selectedEvent.endDate">
            - {{ formatEventTime(selectedEvent.endDate) }}
          </template>
        </div>
        <div v-if="selectedEvent.location" class="mb-2">
          <strong><i class="bi bi-geo-alt me-2" />Location:</strong>
          {{ selectedEvent.location }}
        </div>
        <div class="mb-2">
          <strong><i class="bi bi-tag me-2" />Category:</strong>
          {{ selectedEvent.category }}
        </div>
        <div v-if="selectedEvent.reminder" class="mb-3">
          <strong><i class="bi bi-bell me-2" />Reminder:</strong>
          {{ selectedEvent.reminder }} minutes before
        </div>
        <div class="d-flex justify-content-end gap-2">
          <AppButton variant="outline-primary" icon="pencil" @click="editSelectedEvent">
            Edit
          </AppButton>
          <AppButton variant="danger" icon="trash" @click="deleteSelectedEvent">
            Delete
          </AppButton>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCalendarStore } from '../../stores/calendarStore'
import { useAppStore } from '../../stores/appStore'
import AppCard from '../../components/common/AppCard.vue'
import AppButton from '../../components/common/AppButton.vue'
import AppModal from '../../components/common/AppModal.vue'
import CalendarGrid from '../../components/calendar/CalendarGrid.vue'
import EventList from '../../components/calendar/EventList.vue'
import EventForm from '../../components/calendar/EventForm.vue'
import { formatEventTime } from '../../utils/date'

const route = useRoute()
const router = useRouter()
const calendarStore = useCalendarStore()
const appStore = useAppStore()

const showModal = ref(false)
const showDetailsModal = ref(false)
const editingEvent = ref(null)
const selectedEvent = ref(null)

const formatSelectedDate = computed(() => {
  return calendarStore.selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
})

const handleDateSelect = (date) => {
  calendarStore.setSelectedDate(date)
}

const getEventDay = (dateString) => {
  return new Date(dateString).getDate()
}

const getEventMonth = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short' })
}

const openCreateModal = () => {
  editingEvent.value = null
  showModal.value = true
}

const openEditModal = (event) => {
  editingEvent.value = event
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingEvent.value = null
}

const handleEventSubmit = (eventData) => {
  if (editingEvent.value) {
    calendarStore.updateEvent(editingEvent.value.id, eventData)
    appStore.addNotification({
      title: 'Event Updated',
      message: `"${eventData.title}" has been updated`
    })
  } else {
    calendarStore.addEvent(eventData)
    appStore.addNotification({
      title: 'Event Created',
      message: `"${eventData.title}" has been added to your calendar`
    })
  }
  closeModal()
}

const showEventDetails = (event) => {
  selectedEvent.value = event
  showDetailsModal.value = true
}

const editSelectedEvent = () => {
  const event = selectedEvent.value
  showDetailsModal.value = false
  openEditModal(event)
}

const deleteSelectedEvent = () => {
  const event = selectedEvent.value
  showDetailsModal.value = false
  handleDeleteEvent(event.id)
}

const handleDeleteEvent = (eventId) => {
  const event = calendarStore.events.find(e => e.id === eventId)
  if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
    calendarStore.deleteEvent(eventId)
    appStore.addNotification({
      title: 'Event Deleted',
      message: `"${event.title}" has been deleted`
    })
  }
}

onMounted(() => {
  if (route.query.action === 'add') {
    openCreateModal()
    router.replace('/calendar')
  }
})
</script>

<style scoped>
.upcoming-event {
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.upcoming-event:hover {
  background: var(--color-background);
}

.event-date-badge {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.event-date-badge .day {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1;
}

.event-date-badge .month {
  font-size: 0.7rem;
  text-transform: uppercase;
}
</style>
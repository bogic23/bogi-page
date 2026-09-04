<template>
  <div class="my-activity-view">
    <div class="activity-header">
      <h1>My Activity</h1>
      <p class="text-muted">
        Overview of your tasks, calendar, and notes
      </p>
    </div>

    <!-- Stats Overview -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-md-6 col-lg-3">
        <div class="stat-card">
          <div class="stat-icon bg-primary-subtle text-primary">
            <i class="bi bi-check2-square" />
          </div>
          <div class="stat-info">
            <div class="stat-value">
              {{ taskStore.incompleteTasks.length }}
            </div>
            <div class="stat-label">
              Pending Tasks
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="stat-card">
          <div class="stat-icon bg-success-subtle text-success">
            <i class="bi bi-check2-all" />
          </div>
          <div class="stat-info">
            <div class="stat-value">
              {{ taskStore.completedTasks.length }}
            </div>
            <div class="stat-label">
              Completed
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="stat-card">
          <div class="stat-icon bg-warning-subtle text-warning">
            <i class="bi bi-calendar-event" />
          </div>
          <div class="stat-info">
            <div class="stat-value">
              {{ upcomingEvents.length }}
            </div>
            <div class="stat-label">
              Upcoming Events
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="stat-card">
          <div class="stat-icon bg-info-subtle text-info">
            <i class="bi bi-journal-text" />
          </div>
          <div class="stat-info">
            <div class="stat-value">
              {{ noteStore.notes.length }}
            </div>
            <div class="stat-label">
              Total Notes
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Tasks Column -->
      <div class="col-12 col-lg-4">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-check2-square me-2" />
              Tasks
            </h5>
            <button class="btn btn-sm btn-primary" @click="openTaskModal()">
              <i class="bi bi-plus me-1" />Add
            </button>
          </div>
          <div class="card-body p-0">
            <div class="list-group list-group-flush">
              <div v-if="taskStore.incompleteTasks.length === 0 && taskStore.loading === false" class="list-group-item text-center py-4">
                <i class="bi bi-check2-all display-4 text-muted mb-2" />
                <p class="mb-2 text-muted">
                  No pending tasks
                </p>
                <button class="btn btn-primary btn-sm" @click="openTaskModal()">
                  Create Task
                </button>
              </div>
              <div v-if="taskStore.loading" class="list-group-item text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <div 
                v-for="task in taskStore.incompleteTasks.slice(0, 5)" 
                :key="task.id" 
                class="list-group-item"
              >
                <div class="d-flex align-items-center">
                  <input
                    type="checkbox"
                    class="form-check-input me-3"
                    :checked="task.completed"
                    @change="toggleTask(task)"
                  >
                  <div class="flex-grow-1">
                    <h6 class="mb-1">
                      {{ task.title }}
                    </h6>
                    <small v-if="task.dueDate" class="text-muted">
                      <i class="bi bi-calendar me-1" />{{ formatDate(task.dueDate) }}
                    </small>
                    <span v-else class="badge bg-secondary">No due date</span>
                  </div>
                  <span class="badge me-2" :class="priorityClass(task.priority)">
                    {{ task.priority }}
                  </span>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-secondary" title="Edit" @click="openTaskModal(task)">
                      <i class="bi bi-pencil" />
                    </button>
                    <button class="btn btn-outline-danger" title="Delete" @click="confirmDeleteTask(task)">
                      <i class="bi bi-trash" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar Column -->
      <div class="col-12 col-lg-4">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-calendar3 me-2" />
              Upcoming Events
            </h5>
            <button class="btn btn-sm btn-primary" @click="openEventModal()">
              <i class="bi bi-plus me-1" />Add
            </button>
          </div>
          <div class="card-body p-0">
            <div class="list-group list-group-flush">
              <div v-if="upcomingEvents.length === 0 && calendarStore.loading === false" class="list-group-item text-center py-4">
                <i class="bi bi-calendar-x display-4 text-muted mb-2" />
                <p class="mb-2 text-muted">
                  No upcoming events
                </p>
                <button class="btn btn-primary btn-sm" @click="openEventModal()">
                  Add Event
                </button>
              </div>
              <div v-if="calendarStore.loading" class="list-group-item text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <div 
                v-for="event in upcomingEvents.slice(0, 5)" 
                :key="event.id" 
                class="list-group-item"
              >
                <div class="d-flex align-items-start">
                  <div class="event-time me-3">
                    <div class="fw-bold">
                      {{ formatEventTime(event.start) }}
                    </div>
                    <small class="text-muted">{{ formatEventDate(event.start) }}</small>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1">
                      {{ event.title }}
                    </h6>
                    <small v-if="event.location" class="text-muted">
                      <i class="bi bi-geo-alt me-1" />{{ event.location }}
                    </small>
                  </div>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-secondary" title="Edit" @click="openEventModal(event)">
                      <i class="bi bi-pencil" />
                    </button>
                    <button class="btn btn-outline-danger" title="Delete" @click="confirmDeleteEvent(event)">
                      <i class="bi bi-trash" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes Column -->
      <div class="col-12 col-lg-4">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-journal-text me-2" />
              Recent Notes
            </h5>
            <button class="btn btn-sm btn-primary" @click="openNoteModal()">
              <i class="bi bi-plus me-1" />Add
            </button>
          </div>
          <div class="card-body p-0">
            <div class="list-group list-group-flush">
              <div v-if="noteStore.notes.length === 0 && noteStore.loading === false" class="list-group-item text-center py-4">
                <i class="bi bi-journal-plus display-4 text-muted mb-2" />
                <p class="mb-2 text-muted">
                  No notes yet
                </p>
                <button class="btn btn-primary btn-sm" @click="openNoteModal()">
                  Create Note
                </button>
              </div>
              <div v-if="noteStore.loading" class="list-group-item text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <div 
                v-for="note in noteStore.notes.slice(0, 5)" 
                :key="note.id" 
                class="list-group-item"
              >
                <div class="d-flex">
                  <div class="flex-grow-1">
                    <h6 class="mb-1">
                      {{ note.title }}
                    </h6>
                    <p class="mb-1 text-muted small">
                      {{ note.content.substring(0, 80) }}{{ note.content.length > 80 ? '...' : '' }}
                    </p>
                    <small class="text-muted">
                      <i class="bi bi-clock me-1" />{{ formatRelativeTime(note.updatedAt) }}
                    </small>
                  </div>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-secondary" title="Edit" @click="openNoteModal(note)">
                      <i class="bi bi-pencil" />
                    </button>
                    <button class="btn btn-outline-danger" title="Delete" @click="confirmDeleteNote(note)">
                      <i class="bi bi-trash" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Modal -->
    <AppModal v-model="showTaskModal" :title="editingTask ? 'Edit Task' : 'New Task'" size="md">
      <form @submit.prevent="saveTask">
        <div class="form-group mb-3">
          <label class="form-label">Title *</label>
          <input
            v-model="taskForm.title"
            type="text"
            class="form-control"
            required
            @input="clearTaskError('title')"
          >
          <div v-if="taskErrors.title" class="text-danger small">
            {{ taskErrors.title }}
          </div>
        </div>
        <div class="form-group mb-3">
          <label class="form-label">Description</label>
          <textarea v-model="taskForm.description" class="form-control" rows="3" />
        </div>
        <div class="row g-3 mb-3">
          <div class="col-6">
            <label class="form-label">Due Date</label>
            <input v-model="taskForm.dueDate" type="date" class="form-control">
          </div>
          <div class="col-6">
            <label class="form-label">Priority</label>
            <select v-model="taskForm.priority" class="form-select">
              <option value="low">
                Low
              </option>
              <option value="medium">
                Medium
              </option>
              <option value="high">
                High
              </option>
            </select>
          </div>
        </div>
        <div class="form-group mb-3">
          <label class="form-label">Category</label>
          <input
            v-model="taskForm.category"
            type="text"
            class="form-control"
            placeholder="e.g., Work, Personal"
          >
        </div>
        <div v-if="taskError" class="alert alert-danger">
          {{ taskError }}
        </div>
      </form>
      <template #footer>
        <button type="button" class="btn btn-secondary" @click="closeTaskModal">
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="taskSaving"
          @click="saveTask"
        >
          <span v-if="taskSaving" class="spinner-border spinner-border-sm me-2" />
          {{ editingTask ? 'Update' : 'Create' }}
        </button>
      </template>
    </AppModal>

    <!-- Event Modal -->
    <AppModal v-model="showEventModal" :title="editingEvent ? 'Edit Event' : 'New Event'" size="md">
      <form @submit.prevent="saveEvent">
        <div class="form-group mb-3">
          <label class="form-label">Title *</label>
          <input
            v-model="eventForm.title"
            type="text"
            class="form-control"
            required
            @input="clearEventError('title')"
          >
          <div v-if="eventErrors.title" class="text-danger small">
            {{ eventErrors.title }}
          </div>
        </div>
        <div class="form-group mb-3">
          <label class="form-label">Description</label>
          <textarea v-model="eventForm.description" class="form-control" rows="3" />
        </div>
        <div class="row g-3 mb-3">
          <div class="col-6">
            <label class="form-label">Start *</label>
            <input
              v-model="eventForm.start"
              type="datetime-local"
              class="form-control"
              required
              @input="clearEventError('start')"
            >
          </div>
          <div class="col-6">
            <label class="form-label">End *</label>
            <input
              v-model="eventForm.end"
              type="datetime-local"
              class="form-control"
              required
              @input="clearEventError('end')"
            >
          </div>
        </div>
        <div class="row g-3 mb-3">
          <div class="col-6">
            <label class="form-label">Category</label>
            <select v-model="eventForm.category" class="form-select">
              <option value="">
                None
              </option>
              <option value="meeting">
                Meeting
              </option>
              <option value="appointment">
                Appointment
              </option>
              <option value="reminder">
                Reminder
              </option>
              <option value="personal">
                Personal
              </option>
              <option value="work">
                Work
              </option>
            </select>
          </div>
          <div class="col-6">
            <label class="form-label">Location</label>
            <input
              v-model="eventForm.location"
              type="text"
              class="form-control"
              placeholder="Location or video link"
            >
          </div>
        </div>
        <div class="form-check mb-3">
          <input
            id="allDay"
            v-model="eventForm.allDay"
            class="form-check-input"
            type="checkbox"
          >
          <label class="form-check-label" for="allDay">All day</label>
        </div>
        <div v-if="eventError" class="alert alert-danger">
          {{ eventError }}
        </div>
      </form>
      <template #footer>
        <button type="button" class="btn btn-secondary" @click="closeEventModal">
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="eventSaving"
          @click="saveEvent"
        >
          <span v-if="eventSaving" class="spinner-border spinner-border-sm me-2" />
          {{ editingEvent ? 'Update' : 'Create' }}
        </button>
      </template>
    </AppModal>

    <!-- Note Modal -->
    <AppModal v-model="showNoteModal" :title="editingNote ? 'Edit Note' : 'New Note'" size="lg">
      <form @submit.prevent="saveNote">
        <div class="form-group mb-3">
          <label class="form-label">Title *</label>
          <input
            v-model="noteForm.title"
            type="text"
            class="form-control"
            required
            @input="clearNoteError('title')"
          >
          <div v-if="noteErrors.title" class="text-danger small">
            {{ noteErrors.title }}
          </div>
        </div>
        <div class="form-group mb-3">
          <label class="form-label">Content *</label>
          <textarea
            v-model="noteForm.content"
            class="form-control"
            rows="8"
            required
            @input="clearNoteError('content')"
          />
          <div v-if="noteErrors.content" class="text-danger small">
            {{ noteErrors.content }}
          </div>
        </div>
        <div class="row g-3 mb-3">
          <div class="col-6">
            <label class="form-label">Category</label>
            <input
              v-model="noteForm.category"
              type="text"
              class="form-control"
              placeholder="e.g., Ideas, Meeting Notes"
            >
          </div>
          <div class="col-6">
            <label class="form-label">Tags (comma separated)</label>
            <input
              v-model="noteForm.tagsInput"
              type="text"
              class="form-control"
              placeholder="tag1, tag2, tag3"
            >
          </div>
        </div>
        <div class="form-check mb-3">
          <input
            id="pinned"
            v-model="noteForm.pinned"
            class="form-check-input"
            type="checkbox"
          >
          <label class="form-check-label" for="pinned">Pin this note</label>
        </div>
        <div v-if="noteError" class="alert alert-danger">
          {{ noteError }}
        </div>
      </form>
      <template #footer>
        <button type="button" class="btn btn-secondary" @click="closeNoteModal">
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="noteSaving"
          @click="saveNote"
        >
          <span v-if="noteSaving" class="spinner-border spinner-border-sm me-2" />
          {{ editingNote ? 'Update' : 'Create' }}
        </button>
      </template>
    </AppModal>

    <!-- Delete Confirmation Modal -->
    <AppModal v-model="showDeleteModal" title="Confirm Delete" size="sm">
      <div class="text-center">
        <p>Are you sure you want to delete <strong>{{ deleteItemType }}</strong> <em>"{{ deleteItemName }}"</em>?</p>
        <p class="text-danger small">
          This action cannot be undone.
        </p>
      </div>
      <template #footer>
        <button type="button" class="btn btn-secondary" @click="closeDeleteModal">
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-danger"
          :disabled="deleting"
          @click="executeDelete"
        >
          <span v-if="deleting" class="spinner-border spinner-border-sm me-2" />
          Delete
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useNoteStore } from '@/stores/noteStore'
import { useCalendarStore } from '@/stores/calendarStore'
import { format, formatDistanceToNow } from 'date-fns'
import AppModal from '@/components/common/AppModal.vue'
import { useAuthStore } from '@/stores/authStore'

const taskStore = useTaskStore()
const noteStore = useNoteStore()
const calendarStore = useCalendarStore()
const authStore = useAuthStore()

// Initialize listeners
onMounted(async () => {
  // Wait for auth to be initialized
  if (authStore.loading) {
    await new Promise(resolve => {
      const unwatch = watch(() => authStore.loading, (loading) => {
        if (!loading) {
          unwatch()
          resolve()
        }
      })
    })
  }
  
  taskStore.initListener()
  noteStore.initListener()
  calendarStore.initListener()
})

onUnmounted(() => {
  taskStore.cleanupListener()
  noteStore.cleanupListener()
  calendarStore.cleanupListener()
})

// Computed
const upcomingEvents = computed(() => {
  const now = new Date()
  return calendarStore.events
    .filter(event => new Date(event.start) >= now)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
})

// Task Modal State
const showTaskModal = ref(false)
const editingTask = ref(null)
const taskSaving = ref(false)
const taskError = ref(null)
const taskErrors = ref({})
const taskForm = ref({
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
  category: ''
})

// Event Modal State
const showEventModal = ref(false)
const editingEvent = ref(null)
const eventSaving = ref(false)
const eventError = ref(null)
const eventErrors = ref({})
const eventForm = ref({
  title: '',
  description: '',
  start: '',
  end: '',
  category: '',
  location: '',
  allDay: false
})

// Note Modal State
const showNoteModal = ref(false)
const editingNote = ref(null)
const noteSaving = ref(false)
const noteError = ref(null)
const noteErrors = ref({})
const noteForm = ref({
  title: '',
  content: '',
  category: '',
  tagsInput: '',
  pinned: false
})

// Delete Confirmation State
const showDeleteModal = ref(false)
const deleteItem = ref(null)
const deleteItemType = ref('')
const deleteItemName = ref('')
const deleting = ref(false)

// Formatters
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = dateStr.toDate ? dateStr.toDate() : new Date(dateStr)
  return format(date, 'MMM d, yyyy')
}

const formatEventDate = (dateStr) => {
  const date = dateStr.toDate ? dateStr.toDate() : new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) return 'Today'
  if (format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) return 'Tomorrow'
  return format(date, 'MMM d')
}

const formatEventTime = (dateStr) => {
  if (!dateStr) return ''
  const date = dateStr.toDate ? dateStr.toDate() : new Date(dateStr)
  return format(date, 'h:mm a')
}

const formatRelativeTime = (date) => {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return formatDistanceToNow(d, { addSuffix: true })
}

const priorityClass = (priority) => {
  const classes = { high: 'bg-danger', medium: 'bg-warning', low: 'bg-success' }
  return classes[priority] || 'bg-secondary'
}

// Task Actions
const toggleTask = async (task) => {
  try {
    await taskStore.toggleTaskComplete(task.id)
  } catch (err) {
    console.error('Failed to toggle task:', err)
  }
}

const openTaskModal = (task = null) => {
  editingTask.value = task
  if (task) {
    taskForm.value = {
      title: task.title || '',
      description: task.description || '',
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
      priority: task.priority || 'medium',
      category: task.category || ''
    }
  } else {
    resetTaskForm()
  }
  taskError.value = null
  taskErrors.value = {}
  showTaskModal.value = true
}

const closeTaskModal = () => {
  showTaskModal.value = false
  editingTask.value = null
  resetTaskForm()
}

const resetTaskForm = () => {
  taskForm.value = {
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: ''
  }
}

const clearTaskError = (field) => {
  taskErrors.value[field] = ''
  taskError.value = null
}

const validateTaskForm = () => {
  let valid = true
  if (!taskForm.value.title.trim()) {
    taskErrors.value.title = 'Title is required'
    valid = false
  }
  return valid
}

const saveTask = async () => {
  if (!validateTaskForm()) return
  
  taskSaving.value = true
  taskError.value = null
  
  try {
    const data = {
      title: taskForm.value.title.trim(),
      description: taskForm.value.description.trim(),
      dueDate: taskForm.value.dueDate || null,
      priority: taskForm.value.priority,
      category: taskForm.value.category.trim()
    }
    
    if (editingTask.value) {
      await taskStore.updateTask(editingTask.value.id, data)
    } else {
      await taskStore.addTask(data)
    }
    closeTaskModal()
  } catch (err) {
    taskError.value = err.message
  } finally {
    taskSaving.value = false
  }
}

// Event Actions
const openEventModal = (event = null) => {
  editingEvent.value = event
  if (event) {
    const start = event.start.toDate ? event.start.toDate() : new Date(event.start)
    const end = event.end.toDate ? event.end.toDate() : new Date(event.end)
    eventForm.value = {
      title: event.title || '',
      description: event.description || '',
      start: format(start, "yyyy-MM-dd'T'HH:mm"),
      end: format(end, "yyyy-MM-dd'T'HH:mm"),
      category: event.category || '',
      location: event.location || '',
      allDay: event.allDay || false
    }
  } else {
    resetEventForm()
  }
  eventError.value = null
  eventErrors.value = {}
  showEventModal.value = true
}

const closeEventModal = () => {
  showEventModal.value = false
  editingEvent.value = null
  resetEventForm()
}

const resetEventForm = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0)
  const end = new Date(start.getTime() + 3600000)
  
  eventForm.value = {
    title: '',
    description: '',
    start: format(start, "yyyy-MM-dd'T'HH:mm"),
    end: format(end, "yyyy-MM-dd'T'HH:mm"),
    category: '',
    location: '',
    allDay: false
  }
}

const clearEventError = (field) => {
  eventErrors.value[field] = ''
  eventError.value = null
}

const validateEventForm = () => {
  let valid = true
  if (!eventForm.value.title.trim()) {
    eventErrors.value.title = 'Title is required'
    valid = false
  }
  if (!eventForm.value.start) {
    eventErrors.value.start = 'Start date/time is required'
    valid = false
  }
  if (!eventForm.value.end) {
    eventErrors.value.end = 'End date/time is required'
    valid = false
  }
  if (eventForm.value.start && eventForm.value.end && new Date(eventForm.value.start) >= new Date(eventForm.value.end)) {
    eventErrors.value.end = 'End must be after start'
    valid = false
  }
  return valid
}

const saveEvent = async () => {
  if (!validateEventForm()) return
  
  eventSaving.value = true
  eventError.value = null
  
  try {
    const data = {
      title: eventForm.value.title.trim(),
      description: eventForm.value.description.trim(),
      start: eventForm.value.start,
      end: eventForm.value.end,
      category: eventForm.value.category,
      location: eventForm.value.location.trim(),
      allDay: eventForm.value.allDay
    }
    
    if (editingEvent.value) {
      await calendarStore.updateEvent(editingEvent.value.id, data)
    } else {
      await calendarStore.addEvent(data)
    }
    closeEventModal()
  } catch (err) {
    eventError.value = err.message
  } finally {
    eventSaving.value = false
  }
}

// Note Actions
const openNoteModal = (note = null) => {
  editingNote.value = note
  if (note) {
    noteForm.value = {
      title: note.title || '',
      content: note.content || '',
      category: note.category || '',
      tagsInput: note.tags?.join(', ') || '',
      pinned: note.pinned || false
    }
  } else {
    resetNoteForm()
  }
  noteError.value = null
  noteErrors.value = {}
  showNoteModal.value = true
}

const closeNoteModal = () => {
  showNoteModal.value = false
  editingNote.value = null
  resetNoteForm()
}

const resetNoteForm = () => {
  noteForm.value = {
    title: '',
    content: '',
    category: '',
    tagsInput: '',
    pinned: false
  }
}

const clearNoteError = (field) => {
  noteErrors.value[field] = ''
  noteError.value = null
}

const validateNoteForm = () => {
  let valid = true
  if (!noteForm.value.title.trim()) {
    noteErrors.value.title = 'Title is required'
    valid = false
  }
  if (!noteForm.value.content.trim()) {
    noteErrors.value.content = 'Content is required'
    valid = false
  }
  return valid
}

const saveNote = async () => {
  if (!validateNoteForm()) return
  
  noteSaving.value = true
  noteError.value = null
  
  try {
    const tags = noteForm.value.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
    
    const data = {
      title: noteForm.value.title.trim(),
      content: noteForm.value.content.trim(),
      category: noteForm.value.category.trim(),
      tags,
      pinned: noteForm.value.pinned
    }
    
    if (editingNote.value) {
      await noteStore.updateNote(editingNote.value.id, data)
    } else {
      await noteStore.addNote(data)
    }
    closeNoteModal()
  } catch (err) {
    noteError.value = err.message
  } finally {
    noteSaving.value = false
  }
}

// Delete Actions
const confirmDeleteTask = (task) => {
  deleteItem.value = { ...task, type: 'task' }
  deleteItemType.value = 'task'
  deleteItemName.value = task.title
  showDeleteModal.value = true
}

const confirmDeleteEvent = (event) => {
  deleteItem.value = { ...event, type: 'event' }
  deleteItemType.value = 'event'
  deleteItemName.value = event.title
  showDeleteModal.value = true
}

const confirmDeleteNote = (note) => {
  deleteItem.value = { ...note, type: 'note' }
  deleteItemType.value = 'note'
  deleteItemName.value = note.title
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deleteItem.value = null
  deleteItemType.value = ''
  deleteItemName.value = ''
}

const executeDelete = async () => {
  if (!deleteItem.value) return
  
  deleting.value = true
  try {
    switch (deleteItem.value.type) {
      case 'task':
        await taskStore.deleteTask(deleteItem.value.id)
        break
      case 'event':
        await calendarStore.deleteEvent(deleteItem.value.id)
        break
      case 'note':
        await noteStore.deleteNote(deleteItem.value.id)
        break
    }
    closeDeleteModal()
  } catch (err) {
    console.error('Delete failed:', err)
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.my-activity-view {
  padding: var(--spacing-lg);
}

.activity-header {
  margin-bottom: var(--spacing-lg);
}

.activity-header h1 {
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  height: 100%;
  transition: all var(--transition-fast);
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-muted);
}

.card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.card-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md) var(--spacing-lg);
}

.card-header h5 {
  font-weight: 600;
  color: var(--color-text);
}

.list-group-item {
  border: none;
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md) var(--spacing-lg);
}

.list-group-item:last-child {
  border-bottom: none;
}

.list-group-item:hover {
  background: var(--color-background);
}

.event-time {
  min-width: 60px;
  text-align: center;
}

.event-time .fw-bold {
  font-size: 0.875rem;
  color: var(--color-primary);
}

.badge {
  font-size: 0.7rem;
  padding: 0.35em 0.65em;
  font-weight: 500;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}

.form-label {
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.form-control,
.form-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text);
  font-size: var(--font-size-base);
  transition: var(--transition-fast);
}

.form-control:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.15);
}

.form-check-input {
  margin-top: 0.25em;
}

@media (max-width: 991.98px) {
  .my-activity-view {
    padding: var(--spacing-md);
  }
  
  .stat-card {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .auth-modal {
    margin: var(--spacing-md);
    max-width: calc(100% - 2rem);
  }
}
</style>
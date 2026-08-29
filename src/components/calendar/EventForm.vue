<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label class="form-label">Event Title *</label>
      <input 
        v-model="form.title" 
        type="text" 
        class="form-control" 
        required
        placeholder="Enter event title"
      >
    </div>
    
    <div class="mb-3">
      <label class="form-label">Description</label>
      <textarea 
        v-model="form.description" 
        class="form-control" 
        rows="3"
        placeholder="Enter event description"
      />
    </div>
    
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Start Date & Time *</label>
        <input 
          v-model="form.date" 
          type="datetime-local" 
          class="form-control" 
          required
        >
      </div>
      
      <div class="col-md-6 mb-3">
        <label class="form-label">End Date & Time</label>
        <input 
          v-model="form.endDate" 
          type="datetime-local" 
          class="form-control"
        >
      </div>
    </div>
    
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Category</label>
        <select v-model="form.category" class="form-select">
          <option value="meeting">
            Meeting
          </option>
          <option value="deadline">
            Deadline
          </option>
          <option value="learning">
            Learning
          </option>
          <option value="personal">
            Personal
          </option>
          <option value="work">
            Work
          </option>
        </select>
      </div>
      
      <div class="col-md-6 mb-3">
        <label class="form-label">Location</label>
        <input 
          v-model="form.location" 
          type="text" 
          class="form-control"
          placeholder="Enter location (optional)"
        >
      </div>
    </div>
    
    <div class="mb-3">
      <label class="form-label">Reminder</label>
      <select v-model="form.reminder" class="form-select">
        <option :value="null">
          No reminder
        </option>
        <option :value="15">
          15 minutes before
        </option>
        <option :value="30">
          30 minutes before
        </option>
        <option :value="60">
          1 hour before
        </option>
        <option :value="1440">
          1 day before
        </option>
      </select>
    </div>
    
    <div class="d-flex justify-content-end gap-2">
      <button type="button" class="btn btn-light" @click="$emit('cancel')">
        Cancel
      </button>
      <button type="submit" class="btn btn-primary">
        <i class="bi bi-check-lg me-1" />
        {{ isEditing ? 'Update Event' : 'Create Event' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  event: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isEditing = computed(() => !!props.event)

const form = ref({
  title: props.event?.title || '',
  description: props.event?.description || '',
  date: props.event?.date ? formatDateForInput(props.event.date) : formatDateForInput(new Date()),
  endDate: props.event?.endDate ? formatDateForInput(props.event.endDate) : '',
  category: props.event?.category || 'meeting',
  location: props.event?.location || '',
  reminder: props.event?.reminder || 30
})

function formatDateForInput(date) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toISOString().slice(0, 16)
}

const handleSubmit = () => {
  emit('submit', { ...form.value })
  
  if (!isEditing.value) {
    // Reset form for new events
    form.value = {
      title: '',
      description: '',
      date: formatDateForInput(new Date()),
      endDate: '',
      category: 'meeting',
      location: '',
      reminder: 30
    }
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label class="form-label">Title *</label>
      <input 
        v-model="form.title" 
        type="text" 
        class="form-control" 
        required
        placeholder="Enter task title"
      >
    </div>
    
    <div class="mb-3">
      <label class="form-label">Description</label>
      <textarea 
        v-model="form.description" 
        class="form-control" 
        rows="3"
        placeholder="Enter task description"
      />
    </div>
    
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Priority</label>
        <select v-model="form.priority" class="form-select">
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
      
      <div class="col-md-6 mb-3">
        <label class="form-label">Category</label>
        <select v-model="form.category" class="form-select">
          <option value="Development">
            Development
          </option>
          <option value="Design">
            Design
          </option>
          <option value="Content">
            Content
          </option>
          <option value="Music">
            Music
          </option>
          <option value="Documentation">
            Documentation
          </option>
          <option value="Personal">
            Personal
          </option>
        </select>
      </div>
    </div>
    
    <div class="mb-3">
      <label class="form-label">Due Date *</label>
      <input 
        v-model="form.dueDate" 
        type="datetime-local" 
        class="form-control" 
        required
      >
    </div>
    
    <div class="d-flex justify-content-end gap-2">
      <button type="button" class="btn btn-light" @click="$emit('cancel')">
        Cancel
      </button>
      <button type="submit" class="btn btn-primary">
        <i class="bi bi-check-lg me-1" />
        {{ isEditing ? 'Update Task' : 'Create Task' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isEditing = computed(() => !!props.task)

const form = ref({
  title: props.task?.title || '',
  description: props.task?.description || '',
  priority: props.task?.priority || 'medium',
  category: props.task?.category || 'Development',
  dueDate: props.task?.dueDate ? formatDateForInput(props.task.dueDate) : ''
})

function formatDateForInput(dateString) {
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16)
}

const handleSubmit = () => {
  emit('submit', { ...form.value })
  
  if (!isEditing.value) {
    // Reset form for new tasks
    form.value = {
      title: '',
      description: '',
      priority: 'medium',
      category: 'Development',
      dueDate: ''
    }
  }
}
</script>
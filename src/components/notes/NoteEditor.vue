<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label class="form-label">Title *</label>
      <input 
        v-model="form.title" 
        type="text" 
        class="form-control form-control-lg" 
        required
        placeholder="Note title"
        @input="autoSave"
      >
    </div>
    
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label">Category</label>
        <select v-model="form.category" class="form-select" @change="autoSave">
          <option value="General">
            General
          </option>
          <option value="Ideas">
            Ideas
          </option>
          <option value="Meetings">
            Meetings
          </option>
          <option value="Music">
            Music
          </option>
          <option value="Development">
            Development
          </option>
          <option value="Planning">
            Planning
          </option>
          <option value="Personal">
            Personal
          </option>
        </select>
      </div>
      <div class="col-md-6">
        <label class="form-label">Tags (comma-separated)</label>
        <input 
          v-model="tagsInput" 
          type="text" 
          class="form-control" 
          placeholder="tag1, tag2, tag3"
          @input="autoSave"
        >
      </div>
    </div>
    
    <div class="mb-3">
      <label class="form-label">Content *</label>
      <textarea 
        v-model="form.content" 
        class="form-control" 
        rows="12" 
        required
        placeholder="Write your note here..."
        @input="autoSave"
      />
    </div>
    
    <div class="mb-3">
      <div class="form-check">
        <input 
          id="pinNote" 
          v-model="form.pinned" 
          type="checkbox" 
          class="form-check-input"
          @change="autoSave"
        >
        <label class="form-check-label" for="pinNote">
          <i class="bi bi-pin me-1" />Pin this note
        </label>
      </div>
    </div>
    
    <div class="d-flex justify-content-between align-items-center">
      <div v-if="lastSaved" class="text-muted small">
        <i class="bi bi-check-circle text-success me-1" />
        Saved {{ getRelativeTime(lastSaved) }}
      </div>
      <div class="d-flex gap-2 ms-auto">
        <button type="button" class="btn btn-light" @click="$emit('cancel')">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary">
          <i class="bi bi-check-lg me-1" />
          {{ isEditing ? 'Update Note' : 'Save Note' }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getRelativeTime } from '../../utils/date'

const props = defineProps({
  note: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel', 'autosave'])

const isEditing = computed(() => !!props.note)
const lastSaved = ref(null)

const form = ref({
  title: props.note?.title || '',
  category: props.note?.category || 'General',
  content: props.note?.content || '',
  pinned: props.note?.pinned || false
})

const tagsInput = ref(props.note?.tags?.join(', ') || '')

const autoSave = () => {
  if (form.value.title || form.value.content) {
    lastSaved.value = new Date().toISOString()
    emit('autosave', {
      ...form.value,
      tags: tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
    })
  }
}

const handleSubmit = () => {
  emit('submit', {
    ...form.value,
    tags: tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  })
  
  if (!isEditing.value) {
    form.value = {
      title: '',
      category: 'General',
      content: '',
      pinned: false
    }
    tagsInput.value = ''
    lastSaved.value = null
  }
}
</script>
<template>
  <div class="notes-view">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1">
          Notes
        </h2>
        <p class="text-muted mb-0">
          Capture ideas, meeting notes, and important information
        </p>
      </div>
      <AppButton variant="primary" icon="plus-lg" @click="openCreateModal">
        New Note
      </AppButton>
    </div>
    
    <!-- Filters -->
    <AppCard class="mb-4">
      <div class="row g-3">
        <div class="col-md-4">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search" /></span>
            <input 
              v-model="filters.search" 
              type="text" 
              class="form-control" 
              placeholder="Search notes..."
              @input="applyFilters"
            >
          </div>
        </div>
        <div class="col-md-3">
          <select v-model="filters.category" class="form-select" @change="applyFilters">
            <option value="all">
              All Categories
            </option>
            <option v-for="category in noteStore.allCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="filters.tag" class="form-select" @change="applyFilters">
            <option value="all">
              All Tags
            </option>
            <option v-for="tag in noteStore.allTags" :key="tag" :value="tag">
              #{{ tag }}
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <select v-model="filters.sortBy" class="form-select" @change="applyFilters">
            <option value="updatedAt">
              Recently Updated
            </option>
            <option value="createdAt">
              Recently Created
            </option>
            <option value="title">
              Title
            </option>
            <option value="category">
              Category
            </option>
          </select>
        </div>
      </div>
    </AppCard>
    
    <!-- Notes Grid -->
    <div v-if="noteStore.filteredNotes.length" class="row">
      <div v-for="note in noteStore.filteredNotes" :key="note.id" class="col-md-6 col-lg-4 mb-4">
        <NoteCard 
          :note="note"
          @view="openViewModal"
          @edit="openEditModal"
          @delete="handleDeleteNote"
          @toggle-pin="handleTogglePin"
        />
      </div>
    </div>
    <AppCard v-else>
      <div class="text-center py-5">
        <i class="bi bi-journal-x fs-1 text-muted" />
        <h5 class="mt-3">
          No notes found
        </h5>
        <p class="text-muted">
          Try adjusting your filters or create a new note
        </p>
        <AppButton variant="primary" icon="plus-lg" @click="openCreateModal">
          Create Note
        </AppButton>
      </div>
    </AppCard>
    
    <!-- Create/Edit Modal -->
    <AppModal 
      v-model="showModal" 
      :title="editingNote ? 'Edit Note' : 'Create New Note'"
      size="xl"
    >
      <NoteEditor 
        :note="editingNote"
        @submit="handleNoteSubmit"
        @cancel="closeModal"
        @autosave="handleAutoSave"
      />
    </AppModal>
    
    <!-- View Note Modal -->
    <AppModal 
      v-model="showViewModal" 
      :title="viewingNote?.title"
      size="lg"
    >
      <div v-if="viewingNote">
        <div class="mb-3">
          <span class="badge bg-light text-muted me-2">{{ viewingNote.category }}</span>
          <span 
            v-for="tag in viewingNote.tags" 
            :key="tag" 
            class="badge bg-light text-muted me-1"
          >
            #{{ tag }}
          </span>
        </div>
        <div class="note-content">
          {{ viewingNote.content }}
        </div>
        <div class="text-muted small mt-3">
          Last updated: {{ formatDate(viewingNote.updatedAt) }}
        </div>
        <div class="d-flex justify-content-end gap-2 mt-3">
          <AppButton 
            variant="outline-primary" 
            :icon="viewingNote.pinned ? 'pin-fill' : 'pin'"
            @click="togglePinFromView"
          >
            {{ viewingNote.pinned ? 'Unpin' : 'Pin' }}
          </AppButton>
          <AppButton variant="primary" icon="pencil" @click="editFromView">
            Edit
          </AppButton>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNoteStore } from '../../stores/noteStore'
import { useAppStore } from '../../stores/appStore'
import AppCard from '../../components/common/AppCard.vue'
import AppButton from '../../components/common/AppButton.vue'
import AppModal from '../../components/common/AppModal.vue'
import NoteCard from '../../components/notes/NoteCard.vue'
import NoteEditor from '../../components/notes/NoteEditor.vue'
import { formatDate } from '../../utils/date'

const route = useRoute()
const router = useRouter()
const noteStore = useNoteStore()
const appStore = useAppStore()

const showModal = ref(false)
const showViewModal = ref(false)
const editingNote = ref(null)
const viewingNote = ref(null)

const filters = ref({
  search: '',
  category: 'all',
  tag: 'all',
  sortBy: 'updatedAt'
})

const applyFilters = () => {
  noteStore.setFilters(filters.value)
}

const openCreateModal = () => {
  editingNote.value = null
  showModal.value = true
}

const openEditModal = (note) => {
  editingNote.value = note
  showModal.value = true
}

const openViewModal = (note) => {
  viewingNote.value = note
  showViewModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingNote.value = null
}

const handleNoteSubmit = (noteData) => {
  if (editingNote.value) {
    noteStore.updateNote(editingNote.value.id, noteData)
    appStore.addNotification({
      title: 'Note Updated',
      message: `"${noteData.title}" has been updated`
    })
  } else {
    const newNote = noteStore.addNote(noteData)
    appStore.addNotification({
      title: 'Note Created',
      message: `"${newNote.title}" has been created`
    })
  }
  closeModal()
}

const handleAutoSave = (noteData) => {
  if (editingNote.value) {
    noteStore.updateNote(editingNote.value.id, noteData)
  }
}

const handleDeleteNote = (noteId) => {
  const note = noteStore.getNoteById(noteId)
  if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
    noteStore.deleteNote(noteId)
    appStore.addNotification({
      title: 'Note Deleted',
      message: `"${note.title}" has been deleted`
    })
  }
}

const handleTogglePin = (noteId) => {
  noteStore.togglePin(noteId)
  const note = noteStore.getNoteById(noteId)
  appStore.addNotification({
    title: note.pinned ? 'Note Pinned' : 'Note Unpinned',
    message: `"${note.title}" has been ${note.pinned ? 'pinned' : 'unpinned'}`
  })
}

const togglePinFromView = () => {
  if (viewingNote.value) {
    handleTogglePin(viewingNote.value.id)
    viewingNote.value = noteStore.getNoteById(viewingNote.value.id)
  }
}

const editFromView = () => {
  const note = viewingNote.value
  showViewModal.value = false
  openEditModal(note)
}

onMounted(() => {
  if (route.query.action === 'add') {
    openCreateModal()
    router.replace('/notes')
  }
  
  noteStore.setFilters(filters.value)
})
</script>

<style scoped>
.note-content {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>
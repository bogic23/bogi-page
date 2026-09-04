<template>
  <div class="scores-view">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <div>
        <h2 class="mb-1">
          <i class="bi bi-music-note-beamed me-2 text-primary" />
          My Scores
        </h2>
        <p class="text-muted mb-0">
          Upload and manage your sheet music collection
        </p>
      </div>
      <AppButton 
        variant="primary" 
        icon="cloud-upload" 
        :loading="scoreStore.uploading"
        :disabled="!scoreStore.isReady"
        @click="openUploadModal"
      >
        Upload Score
      </AppButton>
    </div>

    <!-- Stats -->
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <AppCard variant="info" hover>
          <div class="d-flex align-items-center">
            <div class="stat-icon bg-primary bg-opacity-10 text-primary">
              <i class="bi bi-file-earmark-music fs-4" />
            </div>
            <div class="ms-3">
              <div class="stat-value fw-bold fs-4">
                {{ scoreStore.totalScores }}
              </div>
              <div class="text-muted small">
                Total Scores
              </div>
            </div>
          </div>
        </AppCard>
      </div>
      <div class="col-md-4">
        <AppCard variant="success" hover>
          <div class="d-flex align-items-center">
            <div class="stat-icon bg-success bg-opacity-10 text-success">
              <i class="bi bi-hdd fs-4" />
            </div>
            <div class="ms-3">
              <div class="stat-value fw-bold fs-4">
                {{ scoreStore.totalSize }}
              </div>
              <div class="text-muted small">
                Total Size
              </div>
            </div>
          </div>
        </AppCard>
      </div>
      <div class="col-md-4">
        <AppCard variant="warning" hover>
          <div class="d-flex align-items-center">
            <div class="stat-icon bg-warning bg-opacity-10 text-warning">
              <i class="bi bi-cloud fs-4" />
            </div>
            <div class="ms-3">
              <div class="stat-value fw-bold fs-4">
                {{ scoreStore.isReady ? 'Connected' : 'Not Connected' }}
              </div>
              <div class="text-muted small">
                Google Drive
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </div>

    <!-- Search & Filters -->
    <AppCard class="mb-4">
      <div class="row g-3 align-items-end">
        <div class="col-md-6">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search" /></span>
            <input 
              v-model="filters.search" 
              type="text" 
              class="form-control" 
              placeholder="Search scores..."
              @input="applyFilters"
            >
          </div>
        </div>
        <div class="col-md-3">
          <select v-model="filters.sortBy" class="form-select" @change="applyFilters">
            <option value="createdTime">
              Newest First
            </option>
            <option value="-createdTime">
              Oldest First
            </option>
            <option value="name">
              Name A-Z
            </option>
            <option value="-name">
              Name Z-A
            </option>
            <option value="size">
              Size: Small to Large
            </option>
            <option value="-size">
              Size: Large to Small
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <AppButton 
            variant="outline-secondary" 
            icon="arrow-clockwise" 
            :loading="scoreStore.loading"
            class="w-100"
            @click="refreshScores"
          >
            Refresh
          </AppButton>
        </div>
      </div>
    </AppCard>

    <!-- Scores Grid -->
    <div v-if="filteredScores.length" class="row">
      <div v-for="score in filteredScores" :key="score.id" class="col-md-6 col-lg-4 col-xl-3 mb-4">
        <ScoreCard 
          :score="score"
          @view="handleViewScore"
          @download="handleDownloadScore"
          @delete="handleDeleteScore"
        />
      </div>
    </div>

    <!-- Empty State -->
    <AppCard v-else>
      <div class="text-center py-5">
        <i class="bi bi-music-note-list fs-1 text-muted" />
        <h5 class="mt-3">
          {{ filters.search ? 'No scores found' : 'No scores yet' }}
        </h5>
        <p class="text-muted">
          {{ filters.search ? 'Try adjusting your search' : 'Upload your first sheet music PDF to get started' }}
        </p>
        <AppButton 
          v-if="!filters.search"
          variant="primary" 
          icon="cloud-upload" 
          :disabled="!scoreStore.isReady"
          @click="openUploadModal"
        >
          Upload Score
        </AppButton>
        <AppButton 
          v-else
          variant="outline-secondary" 
          icon="x-circle" 
          @click="clearSearch"
        >
          Clear Search
        </AppButton>
      </div>
    </AppCard>

    <!-- Upload Modal -->
    <AppModal 
      v-model="showUploadModal" 
      title="Upload Sheet Music" 
      size="md"
    >
      <div class="upload-form">
        <div
          class="upload-dropzone" 
          :class="{ 'dragover': isDragover }"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
        >
          <input 
            ref="fileInput" 
            type="file" 
            accept=".pdf" 
            class="d-none" 
            :disabled="scoreStore.uploading"
            @change="handleFileSelect"
          >
          <i v-if="!selectedFile" class="bi bi-cloud-arrow-up fs-1 text-muted mb-3" />
          <i v-if="selectedFile" class="bi bi-file-earmark-pdf fs-1 text-danger mb-3" />
          <p v-if="!selectedFile" class="mb-2">
            <strong>Drag & drop</strong> a PDF file here, or click to browse
          </p>
          <p v-if="selectedFile" class="mb-2 fw-medium">
            {{ selectedFile.name }}
          </p>
          <p class="text-muted small mb-0">
            PDF files only &bull; Max 100MB
          </p>
        </div>

        <div v-if="selectedFile" class="mt-3">
          <label class="form-label">Title (optional)</label>
          <input 
            v-model="uploadTitle" 
            type="text" 
            class="form-control" 
            placeholder="Enter a custom title..."
            :disabled="scoreStore.uploading"
          >
          <div class="form-text">
            Leave empty to use the original filename
          </div>
        </div>

        <div v-if="selectedFile" class="mt-3">
          <label class="form-label">Description (optional)</label>
          <textarea 
            v-model="uploadDescription" 
            class="form-control" 
            rows="3" 
            placeholder="Add a description..."
            :disabled="scoreStore.uploading"
          />
        </div>

        <div v-if="scoreStore.uploadProgress > 0 && scoreStore.uploadProgress < 100" class="mt-3">
          <div class="d-flex justify-content-between mb-1">
            <span class="small">Uploading...</span>
            <span class="small fw-medium">{{ scoreStore.uploadProgress }}%</span>
          </div>
          <div class="progress" style="height: 8px;">
            <div
              class="progress-bar bg-primary" 
              :style="{ width: scoreStore.uploadProgress + '%' }" 
              role="progressbar"
            />
          </div>
        </div>

        <div v-if="scoreStore.error" class="alert alert-danger mt-3 mb-0">
          {{ scoreStore.error }}
        </div>
      </div>
      <template #footer>
        <AppButton variant="secondary" :disabled="scoreStore.uploading" @click="closeUploadModal">
          Cancel
        </AppButton>
        <AppButton 
          variant="primary" 
          icon="cloud-upload" 
          :loading="scoreStore.uploading"
          :disabled="!selectedFile || scoreStore.uploading"
          @click="handleUpload"
        >
          Upload
        </AppButton>
      </template>
    </AppModal>

    <!-- Delete Confirmation Modal -->
    <AppModal 
      v-model="showDeleteModal" 
      title="Delete Score" 
      size="sm"
    >
      <p v-if="scoreToDelete">
        Are you sure you want to delete <strong>"{{ scoreToDelete.name }}"</strong>?
        <br>
        <span class="text-muted small">This action cannot be undone.</span>
      </p>
      <template #footer>
        <AppButton variant="secondary" @click="closeDeleteModal">
          Cancel
        </AppButton>
        <AppButton 
          variant="danger" 
          icon="trash" 
          :loading="scoreStore.loading"
          @click="confirmDelete"
        >
          Delete
        </AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useScoreStore } from '@/stores/scoreStore'
import { useAppStore } from '@/stores/appStore'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'

const scoreStore = useScoreStore()
const appStore = useAppStore()

const showUploadModal = ref(false)
const showDeleteModal = ref(false)
const selectedFile = ref(null)
const scoreToDelete = ref(null)
const uploadTitle = ref('')
const uploadDescription = ref('')
const isDragover = ref(false)
const fileInput = ref(null)

const filters = ref({
  search: '',
  sortBy: 'createdTime'
})

const filteredScores = computed(() => {
  let filtered = [...scoreStore.sortedScores]

  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase()
    filtered = filtered.filter(score =>
      score.name.toLowerCase().includes(searchLower)
    )
  }

  const sortBy = filters.value.sortBy
  const isDesc = sortBy.startsWith('-')
  const field = isDesc ? sortBy.slice(1) : sortBy

  filtered.sort((a, b) => {
    let aVal = a[field]
    let bVal = b[field]

    if (field === 'size') {
      aVal = parseInt(a.size) || 0
      bVal = parseInt(b.size) || 0
    } else if (field === 'createdTime' || field === 'modifiedTime') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    } else if (field === 'name') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (aVal < bVal) return isDesc ? 1 : -1
    if (aVal > bVal) return isDesc ? -1 : 1
    return 0
  })

  return filtered
})

const applyFilters = () => {
  // Reactive, no action needed
}

const clearSearch = () => {
  filters.value.search = ''
}

const refreshScores = async () => {
  try {
    await scoreStore.fetchScores()
    appStore.addNotification({
      title: 'Refreshed',
      message: 'Scores list updated'
    })
  } catch (err) {
    appStore.addNotification({
      title: 'Error',
      message: 'Failed to refresh scores',
      type: 'error'
    })
  }
}

const openUploadModal = () => {
  selectedFile.value = null
  uploadTitle.value = ''
  uploadDescription.value = ''
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFile.value = null
  uploadTitle.value = ''
  uploadDescription.value = ''
  scoreStore.clearError()
}

const triggerFileInput = () => {
  if (!scoreStore.uploading) {
    fileInput.value?.click()
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleDragOver = (event) => {
  isDragover.value = true
  event.dataTransfer.dropEffect = 'copy'
}

const handleDragLeave = () => {
  isDragover.value = false
}

const handleDrop = (event) => {
  isDragover.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const validateAndSetFile = (file) => {
  if (file.type !== 'application/pdf') {
    appStore.addNotification({
      title: 'Invalid File',
      message: 'Please select a PDF file',
      type: 'error'
    })
    return
  }

  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    appStore.addNotification({
      title: 'File Too Large',
      message: 'File must be less than 100MB',
      type: 'error'
    })
    return
  }

  selectedFile.value = file
  if (!uploadTitle.value) {
    uploadTitle.value = file.name.replace(/\.pdf$/i, '')
  }
}

const handleUpload = async () => {
  if (!selectedFile.value) return

  try {
    await scoreStore.uploadScore(selectedFile.value, {
      name: uploadTitle.value || selectedFile.value.name,
      description: uploadDescription.value
    })
    appStore.addNotification({
      title: 'Upload Complete',
      message: `"${uploadTitle.value || selectedFile.value.name}" has been uploaded`
    })
    closeUploadModal()
  } catch (err) {
    // Error is handled in store and shown in modal
  }
}

const handleViewScore = (score) => {
  scoreStore.openScore(score)
}

const handleDownloadScore = (score) => {
  scoreStore.downloadScore(score)
  appStore.addNotification({
    title: 'Download Started',
    message: `"${score.name}" is downloading`
  })
}

const handleDeleteScore = (score) => {
  scoreToDelete.value = score
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  scoreToDelete.value = null
}

const confirmDelete = async () => {
  if (!scoreToDelete.value) return

  try {
    const name = scoreToDelete.value.name
    await scoreStore.deleteScore(scoreToDelete.value.id)
    appStore.addNotification({
      title: 'Score Deleted',
      message: `"${name}" has been deleted`
    })
    closeDeleteModal()
  } catch (err) {
    appStore.addNotification({
      title: 'Error',
      message: 'Failed to delete score',
      type: 'error'
    })
  }
}

onMounted(async () => {
  try {
    await scoreStore.initialize()
    await scoreStore.fetchScores()
  } catch (err) {
    appStore.addNotification({
      title: 'Error',
      message: 'Failed to initialize Google Drive. Please check your connection.',
      type: 'error'
    })
  }
})

// Watch for auth changes
watch(() => scoreStore.isReady, (isReady) => {
  if (isReady && scoreStore.scores.length === 0) {
    scoreStore.fetchScores()
  }
})
</script>

<style scoped>
.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  line-height: 1.2;
}

.upload-dropzone {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-base);
  background: var(--color-background);
}

.upload-dropzone:hover,
.upload-dropzone.dragover {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
}

.upload-dropzone:focus-within {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.progress {
  background-color: var(--color-border);
  border-radius: 4px;
}

.progress-bar {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  .progress-bar {
    transition-duration: 0.01ms !important;
  }
}
</style>
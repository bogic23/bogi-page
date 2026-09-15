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
          Browse and manage sheet music collection
        </p>
      </div>
      <AppButton 
        v-if="authStore.isAdmin"
        variant="primary" 
        icon="cloud-upload" 
        :loading="scoreStore.uploading"
        :disabled="!scoreStore.isReady"
        @click="openUploadModal"
      >
        Upload Score
      </AppButton>
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
            <option value="publishedDate">
              Newest First
            </option>
            <option value="-publishedDate">
              Oldest First
            </option>
            <option value="name">
              Name A-Z
            </option>
            <option value="-name">
              Name Z-A
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

    <!-- Scores Table -->
    <AppCard v-if="filteredScores.length">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th style="width: 40%;">
                Title
              </th>
              <th style="width: 20%;">
                Published Date
              </th>
              <th style="width: 25%;">
                Notes
              </th>
              <th style="width: 15%;" class="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="score in filteredScores" :key="score.id">
              <td>
                <div class="d-flex align-items-center">
                  <i class="bi bi-file-earmark-music text-primary me-2 fs-5" />
                  <div>
                    <div class="fw-medium">
                      {{ score.name }}
                    </div>
                    <div class="text-muted small">
                      {{ formatFileSize(score.size) }}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                {{ score.publishedDate ? formatPublishedDate(score.publishedDate) : '—' }}
              </td>
              <td>
                <span
                  v-if="score.notes"
                  class="text-muted"
                  style="max-width: 200px;"
                  title="{{ score.notes }}"
                >
                  {{ score.notes }}
                </span>
                <span v-else class="text-muted fst-italic">—</span>
              </td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <AppButton 
                    size="sm" 
                    variant="outline-primary" 
                    icon="eye" 
                    title="View"
                    @click="handleViewScore(score)"
                  />
                  <AppButton 
                    size="sm" 
                    variant="outline-secondary" 
                    icon="download" 
                    title="Download"
                    @click="handleDownloadScore(score)"
                  />
                  <AppButton 
                    size="sm" 
                    variant="outline-success" 
                    icon="file-text" 
                    title="Create License"
                    @click="openLicenseModal(score)"
                  />
                  <AppButton 
                    v-if="authStore.isAdmin"
                    size="sm" 
                    variant="outline-danger" 
                    icon="trash" 
                    title="Delete"
                    @click="handleDeleteScore(score)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>

    <!-- Empty State -->
    <AppCard v-else>
      <div class="text-center py-5">
        <i class="bi bi-music-note-list fs-1 text-muted" />
        <h5 class="mt-3">
          {{ filters.search ? 'No scores found' : 'No scores yet' }}
        </h5>
        <p class="text-muted">
          {{ filters.search ? 'Try adjusting your search' : 'Scores will appear here once uploaded' }}
        </p>
        <AppButton 
          v-if="!filters.search && authStore.isAdmin"
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

        <div v-if="selectedFile" class="mt-3">
          <label class="form-label">Published Date <span class="text-danger">*</span></label>
          <input 
            v-model="uploadPublishedDate" 
            type="date" 
            class="form-control" 
            :disabled="scoreStore.uploading"
            required
          >
        </div>

        <div v-if="selectedFile" class="mt-3">
          <label class="form-label">Notes (optional)</label>
          <textarea 
            v-model="uploadNotes" 
            class="form-control" 
            rows="3" 
            placeholder="Add notes about this score..."
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

    <!-- Create License Modal -->
    <AppModal 
      v-model="showLicenseModal" 
      title="Create Arrangement License" 
      size="lg"
    >
      <div class="license-form">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Arranger Name <span class="text-danger">*</span></label>
            <input 
              v-model="licenseForm.arrangerName" 
              type="text" 
              class="form-control" 
              placeholder="Enter arranger full name"
              required
            >
          </div>
          <div class="col-md-6">
            <label class="form-label">Arranger Role</label>
            <input 
              v-model="licenseForm.arrangerRole" 
              type="text" 
              class="form-control" 
              placeholder="e.g., Arranger, Composer"
              value="Arranger"
            >
          </div>
          <div class="col-md-6">
            <label class="form-label">Arrangement Title <span class="text-danger">*</span></label>
            <input 
              v-model="licenseForm.arrangementTitle" 
              type="text" 
              class="form-control" 
              placeholder="Enter arrangement title"
              required
            >
          </div>
          <div class="col-md-6">
            <label class="form-label">Permission Granted To <span class="text-danger">*</span></label>
            <input 
              v-model="licenseForm.granteeName" 
              type="text" 
              class="form-control" 
              placeholder="Enter name of person receiving permission"
              required
            >
          </div>
          <div class="col-md-6">
            <label class="form-label">Issued At (City) <span class="text-danger">*</span></label>
            <input 
              v-model="licenseForm.issuedAt" 
              type="text" 
              class="form-control" 
              placeholder="e.g., Jakarta"
              required
            >
          </div>
          <div class="col-md-6">
            <label class="form-label">Date <span class="text-danger">*</span></label>
            <input 
              v-model="licenseForm.date" 
              type="date" 
              class="form-control" 
              required
            >
          </div>
          <div class="col-md-6">
            <label class="form-label">Arranger Email</label>
            <input 
              v-model="licenseForm.arrangerEmail" 
              type="email" 
              class="form-control" 
              placeholder="arranger@example.com"
            >
          </div>
        </div>

        <div class="mt-4">
          <label class="form-label">License Preview</label>
          <div class="license-preview">
            <pre v-html="licensePreview"></pre>
          </div>
        </div>
      </div>
      <template #footer>
        <AppButton variant="secondary" @click="closeLicenseModal">
          Cancel
        </AppButton>
        <AppButton 
          variant="outline-secondary"
          icon="clipboard"
          @click="copyLicense"
          :disabled="!isLicenseValid"
        >
          Copy License
        </AppButton>
        <AppButton 
          variant="primary" 
          icon="download"
          @click="downloadLicense"
          :disabled="!isLicenseValid"
        >
          Download as Text
        </AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { jsPDF } from 'jspdf'
import { useScoreStore } from '@/stores/scoreStore'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'
import { formatDate, formatFileSize } from '@/utils/dateUtils'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'

const scoreStore = useScoreStore()
const authStore = useAuthStore()
const appStore = useAppStore()

const formatPublishedDate = (date) => {
  if (!date) return '—'
  const d = date.toDate ? date.toDate() : new Date(date)
  return formatDate(d)
}

const showUploadModal = ref(false)
const showDeleteModal = ref(false)
const showLicenseModal = ref(false)
const selectedFile = ref(null)
const scoreToDelete = ref(null)
const scoreForLicense = ref(null)
const uploadTitle = ref('')
const uploadDescription = ref('')
const uploadPublishedDate = ref('')
const uploadNotes = ref('')
const isDragover = ref(false)
const fileInput = ref(null)

const licenseForm = ref({
  arrangerName: '',
  arrangerRole: 'Arranger',
  arrangementTitle: '',
  granteeName: '',
  issuedAt: 'Jakarta',
  date: new Date().toISOString().split('T')[0],
  arrangerEmail: ''
})

const filters = ref({
  search: '',
  sortBy: 'createdTime'
})

const filteredScores = computed(() => {
  let filtered = [...scoreStore.scores]

  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase()
    filtered = filtered.filter(score =>
      score.name.toLowerCase().includes(searchLower) ||
      (score.notes && score.notes.toLowerCase().includes(searchLower))
    )
  }

  const sortBy = filters.value.sortBy
  const isDesc = sortBy.startsWith('-')
  const field = isDesc ? sortBy.slice(1) : sortBy

  filtered.sort((a, b) => {
    let aVal = a[field]
    let bVal = b[field]

    if (field === 'publishedDate') {
      const aDate = aVal?.toDate ? aVal.toDate() : new Date(aVal)
      const bDate = bVal?.toDate ? bVal.toDate() : new Date(bVal)
      aVal = aDate.getTime()
      bVal = bDate.getTime()
    } else if (field === 'name') {
      aVal = (aVal || '').toLowerCase()
      bVal = (bVal || '').toLowerCase()
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
  uploadPublishedDate.value = new Date().toISOString().split('T')[0]
  uploadNotes.value = ''
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFile.value = null
  uploadTitle.value = ''
  uploadDescription.value = ''
  uploadPublishedDate.value = ''
  uploadNotes.value = ''
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
      description: uploadDescription.value,
      publishedDate: uploadPublishedDate.value,
      notes: uploadNotes.value
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

const openLicenseModal = (score) => {
  scoreForLicense.value = score
  licenseForm.value = {
    arrangerName: '',
    arrangerRole: 'Arranger',
    arrangementTitle: score.name,
    granteeName: '',
    issuedAt: 'Jakarta',
    date: new Date().toISOString().split('T')[0],
    arrangerEmail: ''
  }
  showLicenseModal.value = true
}

const closeLicenseModal = () => {
  showLicenseModal.value = false
  scoreForLicense.value = null
  licenseForm.value = {
    arrangerName: '',
    arrangerRole: 'Arranger',
    arrangementTitle: '',
    granteeName: '',
    issuedAt: 'Jakarta',
    date: new Date().toISOString().split('T')[0],
    arrangerEmail: ''
  }
}

const isLicenseValid = computed(() => {
  return licenseForm.value.arrangerName.trim() &&
         licenseForm.value.arrangementTitle.trim() &&
         licenseForm.value.granteeName.trim() &&
         licenseForm.value.issuedAt.trim() &&
         licenseForm.value.date
})

const generateLicenseText = () => {
  const f = licenseForm.value
  const dateObj = new Date(f.date)
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) + ` (${dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })})`

  const maxLabelWidth = Math.max(
    'Name: '.length,
    'Role: '.length,
    'Title of Arrangement: '.length
  )

  const padLabel = (label) => label.padEnd(maxLabelWidth)

  return `                    SONG ARRANGEMENT LICENSE LETTER

I, the undersigned:
${padLabel('Name: ')}${f.arrangerName}
${padLabel('Role: ')}${f.arrangerRole}
${padLabel('Title of Arrangement: ')}${f.arrangementTitle}

hereby state that I am the legitimate arranger of the musical arrangement titled "${f.arrangementTitle}".
Through this letter, I officially grant permission to ${f.granteeName} to
use, rehearse, perform, and present my arrangement of ${f.arrangementTitle} for artistic, educational, and performance purposes. This
permission includes usage for concerts, competitions, rehearsals, and
related non-commercial promotional activities.
This permission does not transfer ownership of the arrangement. All
intellectual property rights remain with me as the arranger.
This letter is made truthfully and may be used as an official written authorization.

Issued at: ${f.issuedAt}
Date: ${formattedDate}


Sincerely, ${f.arrangerName}
${f.arrangerRole} – ${f.arrangementTitle}${f.arrangerEmail ? `\nEmail: ${f.arrangerEmail}` : ''}`
}

const licensePreview = computed(() => {
  const text = generateLicenseText()
  return text.replace(/\n/g, '<br>')
})

const copyLicense = () => {
  const text = generateLicenseText()
  navigator.clipboard.writeText(text).then(() => {
    appStore.addNotification({
      title: 'Copied',
      message: 'License text copied to clipboard'
    })
  }).catch(() => {
    appStore.addNotification({
      title: 'Error',
      message: 'Failed to copy license',
      type: 'error'
    })
  })
}

const downloadLicense = () => {
  const text = generateLicenseText()
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })
  
  const pageWidth = 210
  const pageHeight = 297
  const marginLeft = 25
  const marginRight = 25
  const marginTop = 25
  const marginBottom = 25
  const contentWidth = pageWidth - marginLeft - marginRight
  const lineHeight = 5
  
  const lines = text.split('\n')
  let y = marginTop
  
  doc.setFont('courier', 'normal')
  doc.setFontSize(10)
  
  lines.forEach((line) => {
    const wrappedLines = doc.splitTextToSize(line, contentWidth)
    
    wrappedLines.forEach((wrappedLine) => {
      if (y + lineHeight > pageHeight - marginBottom) {
        doc.addPage()
        y = marginTop
      }
      doc.text(wrappedLine, marginLeft, y)
      y += lineHeight
    })
  })
  
  const fileName = `license-${licenseForm.value.arrangementTitle.replace(/\s+/g, '-')}.pdf`
  doc.save(fileName)
  
  appStore.addNotification({
    title: 'Downloaded',
    message: 'License PDF downloaded'
  })
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

.license-preview {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  max-height: 400px;
  overflow-y: auto;
  font-family: var(--font-family-mono, monospace);
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.license-preview pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
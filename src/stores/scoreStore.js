import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'
import {
  uploadPdfToDrive,
  listScoresFromDrive,
  deleteScoreFromDrive,
  initGoogleDrive,
  revokeAccessToken,
  isGoogleDriveReady
} from '@/services/googleDrive'
import { formatFileSize, formatDate } from '@/utils/dateUtils'

export const useScoreStore = defineStore('scores', () => {
  const scores = ref([])
  const loading = ref(false)
  const uploading = ref(false)
  const uploadProgress = ref(0)
  const error = ref(null)
  let initialized = false

  const sortedScores = computed(() => {
    return [...scores.value].sort((a, b) => 
      new Date(b.createdTime) - new Date(a.createdTime)
    )
  })

  const totalScores = computed(() => scores.value.length)

  const totalSize = computed(() => {
    return scores.value.reduce((sum, score) => sum + (parseInt(score.size) || 0), 0)
  })

  const initialize = async () => {
    if (initialized) return
    try {
      await initGoogleDrive()
      initialized = true
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const fetchScores = async () => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      scores.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const files = await listScoresFromDrive()
      scores.value = files.map(file => ({
        id: file.id,
        name: file.name,
        webViewLink: file.webViewLink,
        webContentLink: file.webContentLink,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
        size: file.size,
        formattedSize: formatFileSize(file.size),
        formattedDate: formatDate(file.createdTime)
      }))
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const uploadScore = async (file, metadata = {}) => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      throw new Error('Not authenticated')
    }

    if (!file || file.type !== 'application/pdf') {
      throw new Error('Please select a PDF file')
    }

    uploading.value = true
    uploadProgress.value = 0
    error.value = null

    try {
      const result = await uploadPdfToDrive(file, {
        name: metadata.name || file.name,
        description: metadata.description || ''
      })

      uploadProgress.value = 100

      const newScore = {
        id: result.id,
        name: result.name,
        webViewLink: result.webViewLink,
        webContentLink: result.webContentLink,
        createdTime: result.createdTime,
        modifiedTime: result.modifiedTime,
        size: result.size,
        formattedSize: formatFileSize(result.size),
        formattedDate: formatDate(result.createdTime)
      }

      scores.value.unshift(newScore)
      return newScore
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      uploading.value = false
      uploadProgress.value = 0
    }
  }

  const deleteScore = async (scoreId) => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      throw new Error('Not authenticated')
    }

    loading.value = true
    error.value = null

    try {
      await deleteScoreFromDrive(scoreId)
      scores.value = scores.value.filter(s => s.id !== scoreId)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const openScore = (score) => {
    if (score.webViewLink) {
      window.open(score.webViewLink, '_blank')
    }
  }

  const downloadScore = (score) => {
    if (score.webContentLink) {
      const link = document.createElement('a')
      link.href = score.webContentLink
      link.download = score.name
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const clearError = () => {
    error.value = null
  }

  const logout = () => {
    scores.value = []
    revokeAccessToken()
  }

  return {
    scores,
    loading,
    uploading,
    uploadProgress,
    error,
    sortedScores,
    totalScores,
    totalSize,
    initialize,
    fetchScores,
    uploadScore,
    deleteScore,
    openScore,
    downloadScore,
    clearError,
    logout,
    isReady: isGoogleDriveReady
  }
})
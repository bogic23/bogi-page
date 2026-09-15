import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'
import {
  uploadPdfToDrive,
  deleteScoreFromDrive,
  initGoogleDrive,
  revokeAccessToken,
  isGoogleDriveReady
} from '@/services/googleDrive'
import { formatFileSize, formatDate } from '@/utils/dateUtils'
import { db } from '@/firebase/firebase'
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore'

export const useScoreStore = defineStore('scores', () => {
  const scores = ref([])
  const loading = ref(false)
  const uploading = ref(false)
  const uploadProgress = ref(0)
  const error = ref(null)
  let initialized = false

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
      const firestoreScores = await fetchScoresFromFirestore()
      
      const combinedScores = firestoreScores.map(fsScore => ({
        id: fsScore.driveFileId,
        name: fsScore.name,
        webViewLink: fsScore.webViewLink,
        webContentLink: fsScore.webContentLink,
        size: fsScore.size || 0,
        formattedSize: formatFileSize(fsScore.size || 0),
        formattedDate: formatDate(fsScore.publishedDate?.toDate?.() || fsScore.publishedDate),
        publishedDate: fsScore.publishedDate,
        notes: fsScore.notes,
        firestoreId: fsScore.id
      }))

      scores.value = combinedScores
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchScoresFromFirestore = async () => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return []

    try {
      const scoresQuery = query(
        collection(db, 'scores'),
        orderBy('publishedDate', 'desc')
      )
      const snapshot = await getDocs(scoresQuery)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.error('Error fetching scores from Firestore:', err)
      return []
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

    if (!authStore.isAdmin) {
      throw new Error('Only admin users can upload scores')
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

      const publishedDate = metadata.publishedDate ? new Date(metadata.publishedDate) : new Date()
      const notes = metadata.notes || ''

      await addDoc(collection(db, 'scores'), {
        driveFileId: result.id,
        name: metadata.name || file.name,
        publishedDate: publishedDate,
        notes: notes,
        webViewLink: result.webViewLink,
        webContentLink: result.webContentLink,
        size: result.size,
        createdAt: serverTimestamp(),
        createdBy: authStore.user.uid
      })

      newScore.publishedDate = publishedDate
      newScore.notes = notes

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

    if (!authStore.isAdmin) {
      throw new Error('Only admin users can delete scores')
    }

    loading.value = true
    error.value = null

    try {
      const scoreToDelete = scores.value.find(s => s.id === scoreId)
      
      await deleteScoreFromDrive(scoreId)
      
      if (scoreToDelete?.firestoreId) {
        await deleteDoc(doc(db, 'scores', scoreToDelete.firestoreId))
      }
      
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
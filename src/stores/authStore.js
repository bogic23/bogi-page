import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/firebase/firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const initAuth = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          user.value = currentUser
          await ensureUserDoc(currentUser)
          await fetchUserData(currentUser.uid)
        } else {
          user.value = null
        }
        loading.value = false
        resolve()
      })
    })
  }

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        user.value = { 
          ...(user.value || {}), 
          ...userData, 
          uid,
          role: userData.role || 'user'
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
    }
  }

  const register = async (email, password, displayName) => {
    loading.value = true
    error.value = null
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName })

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        displayName,
        role: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      user.value = userCredential.user
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      await ensureUserDoc(userCredential.user)
      await fetchUserData(userCredential.user.uid)
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const loginWithGoogle = async () => {
    loading.value = true
    error.value = null
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')
      const userCredential = await signInWithPopup(auth, provider)
      user.value = userCredential.user
      await ensureUserDoc(userCredential.user)
      await fetchUserData(userCredential.user.uid)
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const ensureUserDoc = async (firebaseUser) => {
    const userRef = doc(db, 'users', firebaseUser.uid)
    const userDoc = await getDoc(userRef)
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || '',
        role: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await signOut(auth)
      user.value = null
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email) => {
    loading.value = true
    error.value = null
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    initAuth,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    clearError
  }
})

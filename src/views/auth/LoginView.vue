<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form class="auth-form" novalidate @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              :class="{ 'is-invalid': errors.email }"
              placeholder="Enter your email"
              autocomplete="email"
              required
              @input="clearError('email')"
            >
            <div v-if="errors.email" class="invalid-feedback">
              {{ errors.email }}
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                :class="{ 'is-invalid': errors.password }"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
                @input="clearError('password')"
              >
              <button
                type="button"
                class="toggle-password"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" />
              </button>
            </div>
            <div v-if="errors.password" class="invalid-feedback">
              {{ errors.password }}
            </div>
          </div>

          <div v-if="authError" class="alert alert-danger">
            {{ authError }}
          </div>

          <div class="form-options">
            <label class="checkbox-wrapper">
              <input v-model="form.remember" type="checkbox">
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-password" @click.prevent="showForgotPassword = true">Forgot password?</a>
          </div>

          <button type="submit" class="btn btn-primary w-100" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
            Sign In
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Don't have an account? <router-link to="/register">
              Sign up
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="modal-overlay" @click.self="showForgotPassword = false">
      <div class="modal auth-modal">
        <div class="modal-header">
          <h5>Reset Password</h5>
          <button class="btn-close" @click="showForgotPassword = false" />
        </div>
        <div class="modal-body">
          <p>Enter your email and we'll send you a link to reset your password.</p>
          <form @submit.prevent="handleForgotPassword">
            <div class="form-group">
              <label for="resetEmail">Email</label>
              <input
                id="resetEmail"
                v-model="resetForm.email"
                type="email"
                :class="{ 'is-invalid': resetErrors.email }"
                placeholder="Enter your email"
                required
                @input="clearResetError('email')"
              >
              <div v-if="resetErrors.email" class="invalid-feedback">
                {{ resetErrors.email }}
              </div>
            </div>
            <div v-if="resetError" class="alert alert-danger">
              {{ resetError }}
            </div>
            <div v-if="resetSuccess" class="alert alert-success">
              {{ resetSuccess }}
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="closeForgotPassword">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="resetLoading">
                <span v-if="resetLoading" class="spinner-border spinner-border-sm me-2" />
                Send Reset Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const authError = ref(null)
const showPassword = ref(false)
const showForgotPassword = ref(false)
const resetLoading = ref(false)
const resetError = ref(null)
const resetSuccess = ref(null)

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({
  email: '',
  password: ''
})

const resetForm = reactive({
  email: ''
})

const resetErrors = reactive({
  email: ''
})

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const clearError = (field) => {
  errors[field] = ''
  authError.value = null
}

const clearResetError = (field) => {
  resetErrors[field] = ''
  resetError.value = null
  resetSuccess.value = null
}

const validateForm = () => {
  let valid = true
  if (!form.email) {
    errors.email = 'Email is required'
    valid = false
  } else if (!validateEmail(form.email)) {
    errors.email = 'Please enter a valid email'
    valid = false
  }
  if (!form.password) {
    errors.password = 'Password is required'
    valid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    valid = false
  }
  return valid
}

const handleLogin = async () => {
  if (!validateForm()) return

  loading.value = true
  authError.value = null

  const result = await authStore.login(form.email, form.password)

  if (result.success) {
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } else {
    authError.value = result.error
  }
  loading.value = false
}

const handleForgotPassword = async () => {
  if (!resetForm.email) {
    resetErrors.email = 'Email is required'
    return
  }
  if (!validateEmail(resetForm.email)) {
    resetErrors.email = 'Please enter a valid email'
    return
  }

  resetLoading.value = true
  resetError.value = null
  resetSuccess.value = null

  const result = await authStore.resetPassword(resetForm.email)

  if (result.success) {
    resetSuccess.value = 'Password reset link sent! Check your email.'
    resetForm.email = ''
  } else {
    resetError.value = result.error
  }
  resetLoading.value = false
}

const closeForgotPassword = () => {
  showForgotPassword.value = false
  resetForm.email = ''
  resetErrors.email = ''
  resetError.value = null
  resetSuccess.value = null
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  padding: var(--spacing-lg);
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--border-color);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.auth-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.auth-header p {
  color: var(--text-secondary);
  font-size: var(--font-size-base);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-group label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input {
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: var(--transition-fast);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.15);
}

.form-group input.is-invalid {
  border-color: var(--danger-color);
}

.form-group input.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(var(--danger-rgb), 0.15);
}

.invalid-feedback {
  font-size: var(--font-size-sm);
  color: var(--danger-color);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: var(--spacing-xs);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: var(--text-primary);
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.checkbox-wrapper input {
  width: 16px;
  height: 16px;
  accent-color: var(--primary-color);
}

.forgot-password {
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

.auth-footer {
  margin-top: var(--spacing-xl);
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.auth-footer a {
  color: var(--primary-color);
  font-weight: 500;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  z-index: 1050;
  animation: fadeIn 0.2s ease;
}

.auth-modal {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 420px;
  border: 1px solid var(--border-color);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h5 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.btn-close {
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  color: var(--text-muted);
  cursor: pointer;
  padding: var(--spacing-xs);
  line-height: 1;
}

.btn-close:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: var(--spacing-lg);
}

.modal-body > p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    padding: var(--spacing-lg);
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
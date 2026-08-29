<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Start your journey with us</p>
        </div>

        <form class="auth-form" novalidate @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="displayName">Display Name</label>
            <input
              id="displayName"
              v-model="form.displayName"
              type="text"
              :class="{ 'is-invalid': errors.displayName }"
              placeholder="Enter your name"
              autocomplete="name"
              required
              @input="clearError('displayName')"
            >
            <div v-if="errors.displayName" class="invalid-feedback">
              {{ errors.displayName }}
            </div>
          </div>

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
                placeholder="Create a password"
                autocomplete="new-password"
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
            <div v-if="form.password" class="password-strength">
              <div class="strength-bar">
                <div
                  class="strength-fill"
                  :class="passwordStrengthClass"
                  :style="{ width: passwordStrength + '%' }"
                />
              </div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="password-input">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                :class="{ 'is-invalid': errors.confirmPassword }"
                placeholder="Confirm your password"
                autocomplete="new-password"
                required
                @input="clearError('confirmPassword')"
              >
              <button
                type="button"
                class="toggle-password"
                :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" />
              </button>
            </div>
            <div v-if="errors.confirmPassword" class="invalid-feedback">
              {{ errors.confirmPassword }}
            </div>
          </div>

          <div v-if="authError" class="alert alert-danger">
            {{ authError }}
          </div>

          <div class="form-group">
            <label class="checkbox-wrapper">
              <input v-model="form.terms" type="checkbox" required>
              <span>
                I agree to the
                <a href="#" @click.prevent="showTerms = true">Terms of Service</a>
                and
                <a href="#" @click.prevent="showPrivacy = true">Privacy Policy</a>
              </span>
            </label>
            <div v-if="errors.terms" class="invalid-feedback">
              {{ errors.terms }}
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
            Create Account
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Already have an account? <router-link to="/login">
              Sign in
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Terms Modal -->
    <div v-if="showTerms" class="modal-overlay" @click.self="showTerms = false">
      <div class="modal auth-modal modal-lg">
        <div class="modal-header">
          <h5>Terms of Service</h5>
          <button class="btn-close" @click="showTerms = false" />
        </div>
        <div class="modal-body terms-content">
          <h6>1. Acceptance of Terms</h6>
          <p>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h6>2. User Accounts</h6>
          <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.</p>
          
          <h6>3. User Content</h6>
          <p>You retain ownership of content you create. By submitting content, you grant us a license to use, modify, and display it.</p>
          
          <h6>4. Prohibited Uses</h6>
          <p>You may not use the service for any unlawful purpose or in violation of these terms.</p>
          
          <h6>5. Termination</h6>
          <p>We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms.</p>
          
          <h6>6. Disclaimer</h6>
          <p>The service is provided "as is" without warranties of any kind.</p>
          
          <h6>7. Limitation of Liability</h6>
          <p>In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
          
          <h6>8. Changes to Terms</h6>
          <p>We reserve the right to modify these terms at any time. Continued use constitutes acceptance of the new terms.</p>
          
          <h6>9. Contact Us</h6>
          <p>If you have any questions about these Terms, please contact us.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="showTerms = false">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Privacy Modal -->
    <div v-if="showPrivacy" class="modal-overlay" @click.self="showPrivacy = false">
      <div class="modal auth-modal modal-lg">
        <div class="modal-header">
          <h5>Privacy Policy</h5>
          <button class="btn-close" @click="showPrivacy = false" />
        </div>
        <div class="modal-body terms-content">
          <h6>1. Information We Collect</h6>
          <p>We collect information you provide directly to us, such as when you create an account or contact us.</p>
          
          <h6>2. How We Use Your Information</h6>
          <p>We use the information we collect to provide, maintain, and improve our services.</p>
          
          <h6>3. Data Storage and Security</h6>
          <p>We implement appropriate security measures to protect your personal information against unauthorized access.</p>
          
          <h6>4. Data Retention</h6>
          <p>We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy.</p>
          
          <h6>5. Your Rights</h6>
          <p>You have the right to access, update, or delete your personal information.</p>
          
          <h6>6. Third-Party Services</h6>
          <p>We may use third-party services that collect, monitor, and analyze data.</p>
          
          <h6>7. Children's Privacy</h6>
          <p>Our service does not address anyone under the age of 13.</p>
          
          <h6>8. Changes to This Policy</h6>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes.</p>
          
          <h6>9. Contact Us</h6>
          <p>If you have any questions about this Privacy Policy, please contact us.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="showPrivacy = false">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const authError = ref(null)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showTerms = ref(false)
const showPrivacy = ref(false)

const form = reactive({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false
})

const errors = reactive({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: ''
})

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const clearError = (field) => {
  errors[field] = ''
  authError.value = null
}

const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 8) strength += 25
  if (/[A-Z]/.test(password)) strength += 25
  if (/[a-z]/.test(password)) strength += 25
  if (/[0-9]/.test(password)) strength += 15
  if (/[^A-Za-z0-9]/.test(password)) strength += 10
  
  return Math.min(strength, 100)
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength < 40) return 'strength-weak'
  if (strength < 70) return 'strength-medium'
  return 'strength-strong'
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return ''
  if (strength < 40) return 'Weak - Add uppercase, numbers, or symbols'
  if (strength < 70) return 'Medium - Good, but could be stronger'
  return 'Strong - Great password!'
})

const validateForm = () => {
  let valid = true
  
  if (!form.displayName.trim()) {
    errors.displayName = 'Display name is required'
    valid = false
  } else if (form.displayName.trim().length < 2) {
    errors.displayName = 'Display name must be at least 2 characters'
    valid = false
  } else if (form.displayName.trim().length > 50) {
    errors.displayName = 'Display name must be less than 50 characters'
    valid = false
  }
  
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
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    valid = false
  } else if (passwordStrength.value < 40) {
    errors.password = 'Password is too weak'
    valid = false
  }
  
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    valid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    valid = false
  }
  
  if (!form.terms) {
    errors.terms = 'You must accept the terms and conditions'
    valid = false
  }
  
  return valid
}

const handleRegister = async () => {
  if (!validateForm()) return

  loading.value = true
  authError.value = null

  const result = await authStore.register(form.email, form.password, form.displayName.trim())

  if (result.success) {
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } else {
    authError.value = result.error
  }
  loading.value = false
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

.password-strength {
  margin-top: var(--spacing-xs);
}

.strength-bar {
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: var(--spacing-xs);
}

.strength-fill {
  height: 100%;
  transition: all var(--transition-normal);
  border-radius: 2px;
}

.strength-fill.strength-weak {
  background: var(--danger-color);
}

.strength-fill.strength-medium {
  background: var(--warning-color);
}

.strength-fill.strength-strong {
  background: var(--success-color);
}

.strength-text {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

.checkbox-wrapper input {
  width: 16px;
  height: 16px;
  accent-color: var(--primary-color);
  margin-top: 2px;
  flex-shrink: 0;
}

.checkbox-wrapper a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.checkbox-wrapper a:hover {
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
  max-width: 500px;
  border: 1px solid var(--border-color);
  animation: slideUp 0.3s ease;
}

.auth-modal.modal-lg {
  max-width: 600px;
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
  max-height: 60vh;
  overflow-y: auto;
}

.terms-content h6 {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  margin: var(--spacing-lg) 0 var(--spacing-xs);
}

.terms-content h6:first-child {
  margin-top: 0;
}

.terms-content p {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 var(--spacing-sm);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
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
  
  .auth-modal.modal-lg {
    max-width: 100%;
    margin: var(--spacing-md);
  }
}
</style>
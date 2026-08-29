<template>
  <section id="contact" v-parallax="{ speed: 0.05 }" class="py-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto text-center mb-5">
          <h2 v-reveal="{ transform: 'translateY(30px)' }" class="display-6 fw-bold mb-3">
            Get In Touch
          </h2>
          <div v-reveal="{ delay: 100, transform: 'scaleX(0)' }" class="divider mx-auto" />
          <p v-reveal="{ transform: 'translateY(20px)', delay: 200 }" class="lead text-muted">
            Have a project in mind or want to collaborate?
          </p>
        </div>
      </div>
      <div class="row">
        <div v-reveal="{ transform: 'translateX(-30px)' }" class="col-lg-5 mb-5">
          <div class="contact-info">
            <h4 class="mb-4">
              Let's Start a Conversation
            </h4>
            <p class="text-muted mb-5">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <div class="contact-methods">
              <div 
                v-for="method in contactMethods" 
                :key="method.label" 
                v-reveal="{ transform: 'translateX(-20px)' }"
                class="contact-method mb-4"
              >
                <div class="method-icon">
                  <i :class="method.icon" />
                </div>
                <div class="method-content">
                  <h6 class="mb-1">
                    {{ method.label }}
                  </h6>
                  <a v-ripple :href="method.href" class="text-muted text-decoration-none">
                    {{ method.value }}
                  </a>
                </div>
              </div>
            </div>
            <div v-stagger="{ delay: 100 }" class="social-links mt-5">
              <a
                v-if="profile.socialLinks.github"
                v-ripple="{ color: 'rgba(14,165,233,0.3)' }"
                v-magnetic="{ strength: 0.3 }"
                :href="profile.socialLinks.github"
                target="_blank"
                class="social-link"
              >
                <i class="bi bi-github" />
              </a>
              <a
                v-if="profile.socialLinks.linkedin"
                v-ripple="{ color: 'rgba(14,165,233,0.3)' }"
                v-magnetic="{ strength: 0.3 }"
                :href="profile.socialLinks.linkedin"
                target="_blank"
                class="social-link"
              >
                <i class="bi bi-linkedin" />
              </a>
              <a
                v-if="profile.socialLinks.twitter"
                v-ripple="{ color: 'rgba(14,165,233,0.3)' }"
                v-magnetic="{ strength: 0.3 }"
                :href="profile.socialLinks.twitter"
                target="_blank"
                class="social-link"
              >
                <i class="bi bi-twitter-x" />
              </a>
            </div>
          </div>
        </div>
        <div v-reveal="{ transform: 'translateX(30px)' }" class="col-lg-7">
          <AppCard class="contact-form-card">
            <form class="needs-validation" novalidate @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-md-6 mb-4">
                  <label for="name" class="form-label">Name</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-person" /></span>
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      class="form-control"
                      required
                      placeholder="Your name"
                    >
                    <div class="invalid-feedback">
                      Please enter your name
                    </div>
                  </div>
                </div>
                <div class="col-md-6 mb-4">
                  <label for="email" class="form-label">Email</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-envelope" /></span>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      class="form-control"
                      required
                      placeholder="your@email.com"
                    >
                    <div class="invalid-feedback">
                      Please enter a valid email
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-4">
                <label for="subject" class="form-label">Subject</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-tag" /></span>
                  <input
                    id="subject"
                    v-model="form.subject"
                    type="text"
                    class="form-control"
                    required
                    placeholder="Project inquiry, collaboration, etc."
                  >
                  <div class="invalid-feedback">
                    Please enter a subject
                  </div>
                </div>
              </div>
              <div class="mb-4">
                <label for="message" class="form-label">Message</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-chat" /></span>
                  <textarea
                    id="message"
                    v-model="form.message"
                    class="form-control"
                    rows="5"
                    required
                    placeholder="Tell me about your project..."
                  />
                  <div class="invalid-feedback">
                    Please enter your message
                  </div>
                </div>
              </div>
              <button 
                v-ripple="{ color: 'rgba(255,255,255,0.3)' }" 
                v-magnetic="{ strength: 0.15 }"
                type="submit"
                class="btn btn-primary btn-lg w-100"
                :disabled="submitting"
              >
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status" />
                <i v-else class="bi bi-send me-2" />
                {{ submitting ? 'Sending...' : 'Send Message' }}
              </button>
            </form>
          </AppCard>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '../../stores/appStore'
import { usePortfolioStore } from '../../stores/portfolioStore'
import AppCard from '../common/AppCard.vue'

const appStore = useAppStore()
const portfolioStore = usePortfolioStore()
const { profile } = portfolioStore

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitting = ref(false)

const contactMethods = [
  {
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: 'bi bi-envelope'
  },
  {
    label: 'Location',
    value: profile.location,
    href: '#',
    icon: 'bi bi-geo-alt'
  },
  {
    label: 'Availability',
    value: 'Open for freelance',
    href: '#',
    icon: 'bi bi-calendar-check'
  }
]

const handleSubmit = async () => {
  const formEl = document.querySelector('.needs-validation')
  if (!formEl.checkValidity()) {
    formEl.classList.add('was-validated')
    return
  }
  
  submitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  appStore.addNotification({
    title: 'Message Sent',
    message: 'Thank you for your message! I will get back to you soon.'
  })
  
  // Reset form
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
  
  formEl.classList.remove('was-validated')
  submitting.value = false
}
</script>

<style scoped>
.divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  border-radius: 2px;
  margin: 20px auto;
  transform-origin: left;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.divider.revealed {
  transform: scaleX(1);
}

.contact-info {
  padding: 1rem 0;
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-background);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.contact-method:hover {
  transform: translateX(8px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.method-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.method-content h6 {
  color: var(--color-text);
  font-weight: 600;
}

.method-content a:hover {
  color: var(--color-primary) !important;
}

.contact-form-card {
  border-top: 4px solid var(--color-primary);
}

.input-group-text {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-right: none;
  color: var(--color-muted);
}

.form-control {
  border: 1px solid var(--color-border);
  padding: 0.875rem 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

.form-control:focus + .input-group-text,
.input-group:focus-within .input-group-text {
  border-color: var(--color-primary);
  background: white;
  color: var(--color-primary);
}

.input-group:focus-within .form-control {
  border-color: var(--color-primary);
}

.was-validated .form-control:invalid {
  border-color: var(--color-danger);
}

.was-validated .form-control:valid {
  border-color: var(--color-success);
}

.btn-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  border: none;
  padding: 1rem 2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.7;
}

.social-link {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0ea5e9;
  font-size: 1.25rem;
  margin-right: 0.75rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.social-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  transform: scale(0);
  border-radius: 50%;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}

.social-link:hover {
  color: white;
  border-color: transparent;
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.4);
}

.social-link:hover::before {
  transform: scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .contact-method,
  .method-icon,
  .method-content a,
  .form-control,
  .input-group-text,
  .btn-primary,
  .social-link {
    transition-duration: 0.01ms !important;
  }
}
</style>
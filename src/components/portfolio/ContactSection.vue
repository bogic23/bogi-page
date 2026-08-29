<template>
  <section id="contact" class="py-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto text-center mb-5">
          <h2 class="display-6 fw-bold mb-3">
            Get In Touch
          </h2>
          <div class="divider mx-auto" />
          <p class="lead text-muted">
            Have a project in mind or want to collaborate?
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-8 mx-auto">
          <AppCard>
            <form @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    required
                  >
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Subject</label>
                <input
                  v-model="form.subject"
                  type="text"
                  class="form-control"
                  required
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Message</label>
                <textarea
                  v-model="form.message"
                  class="form-control"
                  rows="5"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary btn-lg">
                <i class="bi bi-send me-2" />Send Message
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
import AppCard from '../common/AppCard.vue'

const appStore = useAppStore()
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const handleSubmit = () => {
  // In a real app, this would send to a backend
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
}
</script>

<style scoped>
.divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  border-radius: 2px;
  margin: 20px auto;
}
</style>
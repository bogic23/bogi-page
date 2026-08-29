<template>
  <section id="about" v-parallax="{ speed: 0.1 }" class="py-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto text-center mb-5">
          <h2 v-reveal="{ transform: 'translateY(30px)' }" class="display-6 fw-bold mb-3">
            About Me
          </h2>
          <div v-reveal="{ delay: 100, transform: 'scaleX(0)' }" class="divider mx-auto" />
          <p v-reveal="{ transform: 'translateY(20px)', delay: 200 }" class="lead text-muted">
            {{ profile.bio }}
          </p>
        </div>
      </div>
      <div v-stagger="{ delay: 150 }" class="row">
        <div class="col-md-4 mb-4">
          <AppCard v-reveal="{ transform: 'translateY(30px)' }" hover class="text-center h-100">
            <div class="about-icon">
              <i class="bi bi-geo-alt" />
            </div>
            <h5 class="mb-2">
              Location
            </h5>
            <p class="text-muted mb-0">
              {{ profile.location }}
            </p>
          </AppCard>
        </div>
        <div class="col-md-4 mb-4">
          <AppCard v-reveal="{ transform: 'translateY(30px)', delay: 100 }" hover class="text-center h-100">
            <div class="about-icon">
              <i class="bi bi-envelope" />
            </div>
            <h5 class="mb-2">
              Email
            </h5>
            <p class="text-muted mb-0">
              {{ profile.email }}
            </p>
          </AppCard>
        </div>
        <div class="col-md-4 mb-4">
          <AppCard v-reveal="{ transform: 'translateY(30px)', delay: 200 }" hover class="text-center h-100">
            <div class="about-icon">
              <i class="bi bi-briefcase" />
            </div>
            <h5 class="mb-2">
              Experience
            </h5>
            <p class="text-muted mb-0">
              {{ experience.length }}+ Years
            </p>
          </AppCard>
        </div>
      </div>
      
      <div v-stagger="{ delay: 100 }" class="row mt-5">
        <div class="col-md-6 mb-4">
          <AppCard v-reveal="{ transform: 'translateX(-30px)' }" hover class="h-100">
            <h5 class="mb-3 d-flex align-items-center gap-2">
              <i class="bi bi-lightning text-primary" />
              What I Do
            </h5>
            <ul class="list-unstyled">
              <li v-for="item in whatIDo" :key="item" class="mb-2 d-flex align-items-start gap-2">
                <i class="bi bi-check-circle-fill text-success mt-1" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </AppCard>
        </div>
        <div class="col-md-6 mb-4">
          <AppCard v-reveal="{ transform: 'translateX(30px)' }" hover class="h-100">
            <h5 class="mb-3 d-flex align-items-center gap-2">
              <i class="bi bi-heart text-danger" />
              My Values
            </h5>
            <ul class="list-unstyled">
              <li v-for="value in values" :key="value" class="mb-2 d-flex align-items-start gap-2">
                <i class="bi bi-dot text-primary mt-1" />
                <span>{{ value }}</span>
              </li>
            </ul>
          </AppCard>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { usePortfolioStore } from '../../stores/portfolioStore'
import AppCard from '../common/AppCard.vue'

const portfolioStore = usePortfolioStore()
const { profile, experience } = portfolioStore

const whatIDo = [
  'Custom Web Application Development',
  'UI/UX Design & Prototyping',
  'API Design & Integration',
  'Performance Optimization',
  'Code Review & Mentoring',
  'Technical Consulting',
]

const values = [
  'Clean, maintainable code',
  'User-first design thinking',
  'Continuous learning & growth',
  'Transparent communication',
  'Delivering on promises',
  'Building long-term relationships',
]
</script>

<style scoped>
.divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  border-radius: 2px;
  margin: 20px auto;
}

.about-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
  color: #0ea5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
}
</style>
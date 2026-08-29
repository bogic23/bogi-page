<template>
  <section id="about" class="py-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto text-center mb-5">
          <h2 class="display-6 fw-bold mb-3">
            About Me
          </h2>
          <div class="divider mx-auto" />
          <p class="lead text-muted">
            {{ profile.bio }}
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 mb-4">
          <AppCard hover class="text-center h-100">
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
          <AppCard hover class="text-center h-100">
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
          <AppCard hover class="text-center h-100">
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
    </div>
  </section>
</template>

<script setup>
import { usePortfolioStore } from '../../stores/portfolioStore'
import AppCard from '../common/AppCard.vue'

const portfolioStore = usePortfolioStore()
const { profile, experience } = portfolioStore
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
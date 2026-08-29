<template>
  <section id="experience" class="py-5 bg-light">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto text-center mb-5">
          <h2 class="display-6 fw-bold mb-3">
            Experience & Education
          </h2>
          <div class="divider mx-auto" />
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6 mb-4">
          <h4 class="mb-4">
            Work Experience
          </h4>
          <div v-for="exp in experience" :key="exp.id" class="timeline-item mb-4">
            <AppCard>
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 class="mb-1">
                    {{ exp.role }}
                  </h5>
                  <p class="text-muted mb-0">
                    {{ exp.company }}
                  </p>
                </div>
                <span class="badge bg-primary">{{ exp.period }}</span>
              </div>
              <p class="mb-2">
                {{ exp.description }}
              </p>
              <ul class="list-unstyled">
                <li v-for="achievement in exp.achievements" :key="achievement" class="mb-1">
                  <i class="bi bi-check-circle text-success me-2" />
                  {{ achievement }}
                </li>
              </ul>
            </AppCard>
          </div>
        </div>
        <div class="col-lg-6 mb-4">
          <h4 class="mb-4">
            Education
          </h4>
          <div v-for="edu in education" :key="edu.id" class="timeline-item mb-4">
            <AppCard>
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 class="mb-1">
                    {{ edu.degree }}
                  </h5>
                  <p class="text-muted mb-0">
                    {{ edu.school }}
                  </p>
                </div>
                <span class="badge bg-primary">{{ edu.period }}</span>
              </div>
              <p class="mb-0">
                {{ edu.description }}
              </p>
            </AppCard>
          </div>
          
          <h4 class="mb-4 mt-5">
            Music Interests
          </h4>
          <AppCard>
            <div v-for="interest in musicInterests" :key="interest.name" class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 class="mb-0">
                  {{ interest.name }}
                </h6>
                <small class="text-muted">{{ interest.yearsOfExperience }} years experience</small>
              </div>
              <span class="badge bg-light text-muted">{{ interest.level }}</span>
            </div>
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
const { experience, education, musicInterests } = portfolioStore
</script>

<style scoped>
.divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  border-radius: 2px;
  margin: 20px auto;
}

.timeline-item {
  position: relative;
}
</style>
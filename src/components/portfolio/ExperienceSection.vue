<template>
  <section id="experience" v-parallax="{ speed: 0.05 }" class="py-5 bg-light">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto text-center mb-5">
          <h2 v-reveal="{ transform: 'translateY(30px)' }" class="display-6 fw-bold mb-3">
            Experience & Education
          </h2>
          <div v-reveal="{ delay: 100, transform: 'scaleX(0)' }" class="divider mx-auto" />
          <p v-reveal="{ transform: 'translateY(20px)', delay: 200 }" class="lead text-muted">
            My journey so far
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6 mb-4">
          <h4 v-reveal="{ transform: 'translateX(-30px)' }" class="mb-4">
            <i class="bi bi-briefcase text-primary me-2" />
            Work Experience
          </h4>
          <div v-stagger="{ delay: 150 }" class="timeline">
            <div v-for="exp in experience" :key="exp.id" class="timeline-item">
              <AppCard v-reveal="{ transform: 'translateX(-30px)' }" hover>
                <div class="timeline-marker" />
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
                  <li v-for="achievement in exp.achievements" :key="achievement" class="mb-1 d-flex align-items-start gap-2">
                    <i class="bi bi-check-circle text-success mt-1" />
                    {{ achievement }}
                  </li>
                </ul>
              </AppCard>
            </div>
          </div>
        </div>
        <div class="col-lg-6 mb-4">
          <h4 v-reveal="{ transform: 'translateX(30px)' }" class="mb-4">
            <i class="bi bi-mortarboard text-success me-2" />
            Education
          </h4>
          <div v-stagger="{ delay: 150 }" class="timeline">
            <div v-for="edu in education" :key="edu.id" class="timeline-item">
              <AppCard v-reveal="{ transform: 'translateX(30px)' }" hover>
                <div class="timeline-marker" />
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 class="mb-1">
                      {{ edu.degree }}
                    </h5>
                    <p class="text-muted mb-0">
                      {{ edu.school }}
                    </p>
                  </div>
                  <span class="badge bg-success">{{ edu.period }}</span>
                </div>
                <p class="mb-0">
                  {{ edu.description }}
                </p>
              </AppCard>
            </div>
          </div>
           
          <h4 v-reveal="{ transform: 'translateX(30px)' }" class="mb-4 mt-5">
            <i class="bi bi-music-note-beamed text-warning me-2" />
            Music Interests
          </h4>
          <AppCard v-reveal="{ transform: 'translateX(30px)' }">
            <div v-for="interest in musicInterests" :key="interest.name" class="d-flex justify-content-between align-items-center mb-3 p-2 rounded hover-bg">
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
  transform-origin: left;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.divider.revealed {
  transform: scaleX(1);
}

.timeline {
  position: relative;
  padding-left: 1.5rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--color-primary), var(--color-secondary));
  border-radius: 1px;
}

.timeline-item {
  position: relative;
  padding-bottom: 2rem;
}

.timeline-marker {
  position: absolute;
  left: -1.5rem;
  top: 1rem;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 3px solid var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-surface);
  transition: all 0.3s ease;
}

.timeline-item:hover .timeline-marker {
  transform: scale(1.2);
  box-shadow: 0 0 0 4px var(--color-surface), 0 0 15px var(--color-primary);
}

.hover-bg:hover {
  background: var(--color-background);
  border-radius: var(--radius-md);
}

@media (prefers-reduced-motion: reduce) {
  .timeline-marker {
    transition-duration: 0.01ms !important;
  }
}
</style>
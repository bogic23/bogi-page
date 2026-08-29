<template>
  <section id="projects" v-parallax="{ speed: 0.05 }" class="py-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto text-center mb-5">
          <h2 v-reveal="{ transform: 'translateY(30px)' }" class="display-6 fw-bold mb-3">
            Featured Projects
          </h2>
          <div v-reveal="{ delay: 100, transform: 'scaleX(0)' }" class="divider mx-auto" />
          <p v-reveal="{ transform: 'translateY(20px)', delay: 200 }" class="lead text-muted">
            A selection of projects I've worked on
          </p>
        </div>
      </div>
      
      <div v-stagger="{ delay: 150 }" class="row g-4">
        <div 
          v-for="project in projects" 
          :key="project.id" 
          class="col-md-6 col-lg-4"
        >
          <AppCard 
            v-reveal="{ transform: 'translateY(30px)' }" 
            v-magnetic="{ strength: 0.15 }" 
            hover
            class="project-card h-100"
          >
            <div class="project-image">
              <i class="bi bi-folder2-open" />
              <div class="project-overlay">
                <div class="overlay-content">
                  <a
                    v-if="project.github"
                    v-ripple
                    :href="project.github"
                    target="_blank"
                    class="btn btn-light btn-sm"
                  >
                    <i class="bi bi-github me-1" />Code
                  </a>
                  <a
                    v-if="project.demo"
                    v-ripple
                    :href="project.demo"
                    target="_blank"
                    class="btn btn-primary btn-sm"
                  >
                    <i class="bi bi-box-arrow-up-right me-1" />Demo
                  </a>
                </div>
              </div>
            </div>
            <div class="p-4">
              <div class="tech-stack mb-3">
                <span 
                  v-for="tech in project.technologies" 
                  :key="tech" 
                  v-ripple="{ color: 'rgba(14,165,233,0.2)' }"
                  class="badge bg-light text-muted me-1"
                >
                  {{ tech }}
                </span>
              </div>
              <h5 class="mb-2">
                {{ project.title }}
              </h5>
              <p class="text-muted mb-3">
                {{ project.description }}
              </p>
              <div class="d-flex gap-2 project-links">
                <a
                  v-if="project.github"
                  v-ripple
                  :href="project.github"
                  target="_blank"
                  class="btn btn-sm btn-outline-primary"
                >
                  <i class="bi bi-github me-1" />Code
                </a>
                <a
                  v-if="project.demo"
                  v-ripple
                  :href="project.demo"
                  target="_blank"
                  class="btn btn-sm btn-primary"
                >
                  <i class="bi bi-box-arrow-up-right me-1" />Demo
                </a>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
      
      <div v-reveal="{ transform: 'translateY(30px)', delay: 300 }" class="text-center mt-5">
        <a
          v-ripple
          v-magnetic="{ strength: 0.2 }"
          href="#"
          class="btn btn-outline-primary btn-lg px-5"
        >
          <i class="bi bi-arrow-right-circle me-2" />View All Projects
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { usePortfolioStore } from '../../stores/portfolioStore'
import AppCard from '../common/AppCard.vue'

const portfolioStore = usePortfolioStore()
const { projects } = portfolioStore
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

.project-image {
  height: 220px;
  background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.project-image i {
  font-size: 4rem;
  color: #0ea5e9;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: rgba(14, 165, 233, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-card:hover .project-overlay {
  opacity: 1;
  transform: translateY(0);
}

.project-card:hover .project-image i {
  transform: scale(1.2) translateY(-20px);
}

.overlay-content {
  display: flex;
  gap: 1rem;
}

.overlay-content .btn {
  transform: translateY(10px);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-card:hover .overlay-content .btn {
  transform: translateY(0);
}

.project-card:hover .overlay-content .btn:nth-child(2) {
  transition-delay: 0.1s;
}

.project-card {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.project-links .btn {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.tech-stack .badge {
  transition: all 0.2s ease;
}

.tech-stack .badge:hover {
  background: var(--color-primary) !important;
  color: white !important;
  transform: translateY(-2px);
}

@media (prefers-reduced-motion: reduce) {
  .project-image i,
  .project-overlay,
  .overlay-content .btn,
  .project-card,
  .project-links .btn,
  .tech-stack .badge {
    transition-duration: 0.01ms !important;
  }
}
</style>
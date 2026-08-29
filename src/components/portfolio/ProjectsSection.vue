<template>
  <section id="projects" class="py-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto text-center mb-5">
          <h2 class="display-6 fw-bold mb-3">
            Featured Projects
          </h2>
          <div class="divider mx-auto" />
        </div>
      </div>
      <div class="row">
        <div v-for="project in projects" :key="project.id" class="col-md-6 col-lg-4 mb-4">
          <AppCard hover class="project-card h-100">
            <div class="project-image">
              <i class="bi bi-folder2-open" />
            </div>
            <div class="p-4">
              <h5 class="mb-2">
                {{ project.title }}
              </h5>
              <p class="text-muted mb-3">
                {{ project.description }}
              </p>
              <div class="tech-stack mb-3">
                <span v-for="tech in project.technologies" :key="tech" class="badge bg-light text-muted me-1">
                  {{ tech }}
                </span>
              </div>
              <div class="d-flex gap-2">
                <a
                  v-if="project.github"
                  :href="project.github"
                  target="_blank"
                  class="btn btn-sm btn-outline-primary"
                >
                  <i class="bi bi-github me-1" />Code
                </a>
                <a
                  v-if="project.demo"
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
}

.project-image {
  height: 200px;
  background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-image i {
  font-size: 4rem;
  color: #0ea5e9;
}

.project-card {
  transition: transform 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
}
</style>
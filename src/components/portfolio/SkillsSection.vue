<template>
  <section id="skills" class="py-5 bg-light">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto text-center mb-5">
          <h2 class="display-6 fw-bold mb-3">
            Skills & Expertise
          </h2>
          <div class="divider mx-auto" />
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-4">
          <AppCard title="Frontend Development">
            <div v-for="skill in frontendSkills" :key="skill.name" class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span>{{ skill.name }}</span>
                <span class="text-muted">{{ skill.level }}%</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div 
                  class="progress-bar bg-gradient-primary" 
                  :style="{ width: skill.level + '%' }"
                />
              </div>
            </div>
          </AppCard>
        </div>
        <div class="col-md-6 mb-4">
          <AppCard title="Backend & Database">
            <div v-for="skill in backendSkills" :key="skill.name" class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span>{{ skill.name }}</span>
                <span class="text-muted">{{ skill.level }}%</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div 
                  class="progress-bar bg-gradient-primary" 
                  :style="{ width: skill.level + '%' }"
                />
              </div>
            </div>
          </AppCard>
        </div>
        <div class="col-12">
          <AppCard title="Music Skills">
            <div class="row">
              <div v-for="skill in musicSkills" :key="skill.name" class="col-md-6 mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <span>{{ skill.name }}</span>
                  <span class="text-muted">{{ skill.level }}%</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div 
                    class="progress-bar bg-gradient-primary" 
                    :style="{ width: skill.level + '%' }"
                  />
                </div>
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
const { frontendSkills, backendSkills, musicSkills } = portfolioStore
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
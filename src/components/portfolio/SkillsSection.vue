<template>
  <section id="skills" v-parallax="{ speed: 0.05 }" class="py-5 bg-light">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mx-auto text-center mb-5">
          <h2 v-reveal="{ transform: 'translateY(30px)' }" class="display-6 fw-bold mb-3">
            Skills & Expertise
          </h2>
          <div v-reveal="{ delay: 100, transform: 'scaleX(0)' }" class="divider mx-auto" />
          <p v-reveal="{ transform: 'translateY(20px)', delay: 200 }" class="lead text-muted">
            Technologies and tools I work with daily
          </p>
        </div>
      </div>
      
      <div v-stagger="{ delay: 150 }" class="row">
        <div class="col-md-6 mb-4">
          <AppCard v-reveal="{ transform: 'translateX(-30px)' }">
            <template #header>
              <div class="d-flex align-items-center justify-content-between">
                <h5 class="mb-0">
                  <i class="bi bi-layout-text-window-reverse text-primary me-2" />
                  Frontend Development
                </h5>
                <span class="badge bg-primary">{{ frontendSkills.length }} Skills</span>
              </div>
            </template>
            <div
              v-for="skill in frontendSkills"
              :key="skill.name"
              v-reveal="{ transform: 'translateY(20px)' }"
              class="mb-3 skill-item"
            >
              <div class="d-flex justify-content-between mb-1">
                <span class="d-flex align-items-center gap-2">
                  <i v-if="skill.icon" :class="`bi bi-${skill.icon} text-primary`" />
                  {{ skill.name }}
                </span>
                <span class="text-muted fw-medium">{{ skill.level }}%</span>
              </div>
              <div class="progress" style="height: 6px;">
                <div 
                  ref="skillBars" 
                  class="progress-bar bg-gradient-primary"
                  :style="{ width: '0%' }"
                  :data-target="skill.level"
                />
              </div>
            </div>
          </AppCard>
        </div>
        <div class="col-md-6 mb-4">
          <AppCard v-reveal="{ transform: 'translateX(30px)' }">
            <template #header>
              <div class="d-flex align-items-center justify-content-between">
                <h5 class="mb-0">
                  <i class="bi bi-server text-success me-2" />
                  Backend & Database
                </h5>
                <span class="badge bg-success">{{ backendSkills.length }} Skills</span>
              </div>
            </template>
            <div
              v-for="skill in backendSkills"
              :key="skill.name"
              v-reveal="{ transform: 'translateY(20px)' }"
              class="mb-3 skill-item"
            >
              <div class="d-flex justify-content-between mb-1">
                <span class="d-flex align-items-center gap-2">
                  <i v-if="skill.icon" :class="`bi bi-${skill.icon} text-success`" />
                  {{ skill.name }}
                </span>
                <span class="text-muted fw-medium">{{ skill.level }}%</span>
              </div>
              <div class="progress" style="height: 6px;">
                <div 
                  ref="skillBars" 
                  class="progress-bar bg-gradient-success"
                  :style="{ width: '0%' }"
                  :data-target="skill.level"
                />
              </div>
            </div>
          </AppCard>
        </div>
        <div class="col-12">
          <AppCard v-reveal="{ transform: 'translateY(30px)' }">
            <template #header>
              <div class="d-flex align-items-center justify-content-between">
                <h5 class="mb-0">
                  <i class="bi bi-music-note-beamed text-warning me-2" />
                  Music Skills
                </h5>
                <span class="badge bg-warning text-dark">{{ musicSkills.length }} Skills</span>
              </div>
            </template>
            <div class="row">
              <div
                v-for="skill in musicSkills"
                :key="skill.name"
                v-reveal="{ transform: 'translateY(20px)' }"
                class="col-md-6 mb-3 skill-item"
              >
                <div class="d-flex justify-content-between mb-1">
                  <span class="d-flex align-items-center gap-2">
                    <i v-if="skill.icon" :class="`bi bi-${skill.icon} text-warning`" />
                    {{ skill.name }}
                  </span>
                  <span class="text-muted fw-medium">{{ skill.level }}%</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div 
                    ref="skillBars" 
                    class="progress-bar bg-gradient-warning"
                    :style="{ width: '0%' }"
                    :data-target="skill.level"
                  />
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
      
      <div v-reveal="{ transform: 'translateY(30px)' }" class="row mt-5">
        <div class="col-12">
          <AppCard variant="primary" class="text-center">
            <h5 class="mb-3">
              Always Learning
            </h5>
            <p class="text-muted mb-4">
              Currently exploring and expanding my knowledge in:
            </p>
            <div class="d-flex flex-wrap justify-content-center gap-2">
              <span 
                v-for="tech in learningTechs" 
                :key="tech" 
                v-ripple="{ color: 'rgba(14,165,233,0.2)' }"
                class="badge bg-light text-dark px-3 py-2"
              >
                {{ tech }}
              </span>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { usePortfolioStore } from '../../stores/portfolioStore'
import AppCard from '../common/AppCard.vue'

const portfolioStore = usePortfolioStore()
const { frontendSkills, backendSkills, musicSkills } = portfolioStore

const skillBars = ref([])
const skillsAnimated = ref(false)

const learningTechs = [
  'Rust', 'Go', 'WebAssembly', 'Edge Computing',
  'Micro-frontends', 'Design Systems', 'AI/ML Integration'
]

const animateSkillBars = () => {
  if (skillsAnimated.value) return
  skillsAnimated.value = true
  
  skillBars.value.forEach((bar, index) => {
    setTimeout(() => {
      const target = parseInt(bar.dataset.target)
      animateProgressBar(bar, target)
    }, index * 100)
  })
}

const animateProgressBar = (element, target) => {
  const duration = 1500
  const startTime = performance.now()
  
  const update = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.floor(eased * target)
    element.style.width = current + '%'
    
    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }
  
  requestAnimationFrame(update)
}

onMounted(async () => {
  await nextTick()
  
  // Observe skills section for bar animation
  const skillsSection = document.getElementById('skills')
  if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkillBars()
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.3 })
    observer.observe(skillsSection)
  }
})
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

.skill-item {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.progress {
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 1.5s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.bg-gradient-primary {
  background: linear-gradient(90deg, #0ea5e9 0%, #3b82f6 100%);
}

.bg-gradient-success {
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
}

.bg-gradient-warning {
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@media (prefers-reduced-motion: reduce) {
  .progress-bar {
    transition-duration: 0.01ms !important;
  }
  .progress-bar::after {
    animation: none;
  }
}
</style>
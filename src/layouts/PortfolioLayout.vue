<template>
  <div class="portfolio-layout">
    <nav class="navbar navbar-expand-lg navbar-light" :class="navbarClasses">
      <div class="container">
        <router-link class="navbar-brand" to="/portfolio">
          <i class="bi bi-code-square text-primary me-2" />
          <span class="fw-bold">Bogi Page</span>
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#portfolioNav"
          aria-controls="portfolioNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div id="portfolioNav" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="/portfolio" @click.prevent="smoothScrollTo('#')">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#about" @click.prevent="smoothScrollTo('#about')">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#skills" @click.prevent="smoothScrollTo('#skills')">Skills</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#projects" @click.prevent="smoothScrollTo('#projects')">Projects</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#contact" @click.prevent="smoothScrollTo('#contact')">Contact</a>
            </li>
            <li class="nav-item">
              <router-link class="btn btn-primary ms-2" to="/dashboard">
                <i class="bi bi-speedometer2 me-1" />
                Dashboard
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    <router-view />
    
    <footer class="bg-dark text-white py-4 mt-auto">
      <div class="container text-center">
        <p class="mb-0">
          © 2024 Bogi Page. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const lastScrollY = ref(0)
const isScrolled = ref(false)
const ticking = ref(false)

const navbarClasses = computed(() => [
  'shadow-sm',
  'transition-all',
  'duration-300',
  isScrolled.value ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white',
])

const smoothScrollTo = (target) => {
  if (target === '#') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  
  const element = document.querySelector(target)
  if (element) {
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80
    const targetPosition = element.getBoundingClientRect().top + window.scrollY - navbarHeight
    window.scrollTo({ top: targetPosition, behavior: 'smooth' })
  }
}

const handleScroll = () => {
  if (!ticking.value) {
    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY
      isScrolled.value = currentScrollY > 50
      lastScrollY.value = currentScrollY
      ticking.value = false
    })
    ticking.value = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = anchor.getAttribute('href')
      if (target !== '#') {
        e.preventDefault()
        smoothScrollTo(target)
      }
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.portfolio-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 1030;
  padding: 1rem 0;
}

.navbar-brand {
  font-size: 1.5rem;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.nav-link {
  font-weight: 500;
  color: var(--color-text) !important;
  padding: 0.5rem 1rem !important;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #0ea5e9, #3b82f6);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 80%;
}

.nav-link:hover {
  color: var(--color-primary) !important;
  background: rgba(14, 165, 233, 0.1);
}

.navbar-toggler {
  border: none;
  padding: 0.5rem;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.btn-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  border: none;
  padding: 0.625rem 1.25rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
}

footer {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    padding: 1rem 0;
    border-top: 1px solid var(--color-border);
    margin-top: 1rem;
  }
  
  .nav-link {
    text-align: center;
    margin: 0.25rem 1rem;
  }
  
  .nav-link::after {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .navbar,
  .navbar-brand,
  .nav-link,
  .btn-primary {
    transition-duration: 0.01ms !important;
  }
  
  html {
    scroll-behavior: auto !important;
  }
}
</style>
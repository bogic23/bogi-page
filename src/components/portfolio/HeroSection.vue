<template>
  <section ref="heroRef" class="hero-section">
    <div class="hero-background">
      <canvas ref="canvasRef" class="particle-canvas" />
      <div class="gradient-orb orb-1" />
      <div class="gradient-orb orb-2" />
      <div class="gradient-orb orb-3" />
    </div>
    
    <div class="container">
      <div class="row align-items-center min-vh-100">
        <div v-reveal="{ transform: 'translateY(40px)', delay: 200 }" class="col-lg-6">
          <div v-reveal="{ transform: 'translateY(20px)', delay: 400 }" class="hero-badge">
            <span class="badge-dot" />
            <span>Available for freelance projects</span>
          </div>
          
          <h1 v-stagger="{ delay: 100 }" class="display-3 fw-bold mb-4 hero-title">
            <span>Hi, I'm</span>
            <span class="text-gradient">{{ profile.name }}</span>
          </h1>
          
          <h2 v-reveal="{ transform: 'translateY(20px)', delay: 500 }" class="h3 text-muted mb-4">
            {{ profile.title }}
          </h2>
          
          <p v-reveal="{ transform: 'translateY(20px)', delay: 600 }" class="lead mb-5">
            {{ profile.tagline }}
          </p>
          
          <div v-reveal="{ transform: 'translateY(20px)', delay: 700 }" class="d-flex flex-wrap gap-3">
            <a v-ripple="{ color: 'rgba(255,255,255,0.3)' }" href="#contact" class="btn btn-primary btn-lg px-4">
              <i class="bi bi-envelope me-2" />Get In Touch
            </a>
            <a v-magnetic="{ strength: 0.2 }" href="#projects" class="btn btn-outline-primary btn-lg px-4">
              <i class="bi bi-folder2-open me-2" />View Projects
            </a>
          </div>
          
          <div v-stagger="{ delay: 80 }" class="social-links mt-5">
            <a
              v-if="profile.socialLinks.github"
              v-ripple="{ color: 'rgba(14,165,233,0.3)' }"
              v-magnetic="{ strength: 0.3 }"
              :href="profile.socialLinks.github"
              target="_blank"
              class="social-link"
            >
              <i class="bi bi-github" />
            </a>
            <a
              v-if="profile.socialLinks.linkedin"
              v-ripple="{ color: 'rgba(14,165,233,0.3)' }"
              v-magnetic="{ strength: 0.3 }"
              :href="profile.socialLinks.linkedin"
              target="_blank"
              class="social-link"
            >
              <i class="bi bi-linkedin" />
            </a>
            <a
              v-if="profile.socialLinks.twitter"
              v-ripple="{ color: 'rgba(14,165,233,0.3)' }"
              v-magnetic="{ strength: 0.3 }"
              :href="profile.socialLinks.twitter"
              target="_blank"
              class="social-link"
            >
              <i class="bi bi-twitter-x" />
            </a>
          </div>
          
          <div v-reveal="{ transform: 'translateY(30px)', delay: 900 }" class="hero-stats mt-5">
            <div v-for="stat in stats" :key="stat.label" class="stat-item">
              <div class="stat-number" :data-target="stat.value">
                {{ stat.value }}
              </div>
              <div class="stat-label">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>
        
        <div v-reveal="{ transform: 'translateX(40px)', delay: 300 }" class="col-lg-6 d-none d-lg-block">
          <div ref="visualRef" class="hero-visual">
            <div class="floating-card card-1">
              <i class="bi bi-code-slash" />
              <span>Vue 3</span>
            </div>
            <div class="floating-card card-2">
              <i class="bi bi-database" />
              <span>Pinia</span>
            </div>
            <div class="floating-card card-3">
              <i class="bi bi-lightning" />
              <span>Vite</span>
            </div>
            <div class="floating-card card-4">
              <i class="bi bi-github" />
              <span>Open Source</span>
            </div>
            <div class="avatar-wrapper">
              <div class="avatar-circle">
                <i class="bi bi-person" />
              </div>
              <div class="avatar-ring" />
              <div class="avatar-ring ring-2" />
              <div class="avatar-ring ring-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-reveal="{ delay: 1200 }" class="scroll-indicator">
      <div class="mouse">
        <div class="wheel" />
      </div>
      <span>Scroll to explore</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { usePortfolioStore } from '../../stores/portfolioStore'

const portfolioStore = usePortfolioStore()
const { profile } = portfolioStore

const heroRef = ref(null)
const canvasRef = ref(null)
const visualRef = ref(null)
let animationFrame = null
let particles = []
let statsAnimated = false

const stats = [
  { label: 'Projects Completed', value: 50 },
  { label: 'Years Experience', value: 5 },
  { label: 'Happy Clients', value: 30 },
  { label: 'Coffee Cups', value: 2000 },
]

const animateCounter = (element, target) => {
  const duration = 2000
  const startTime = performance.now()
  
  const update = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.floor(eased * target)
    element.textContent = current.toLocaleString()
    
    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }
  
  requestAnimationFrame(update)
}

const initParticles = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const resize = () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  
  resize()
  window.addEventListener('resize', resize)
  
  class Particle {
    constructor() {
      this.reset()
    }
    
    reset() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.size = Math.random() * 2 + 0.5
      this.speedX = (Math.random() - 0.5) * 0.5
      this.speedY = (Math.random() - 0.5) * 0.5
      this.opacity = Math.random() * 0.5 + 0.1
      this.color = Math.random() > 0.5 ? '#0ea5e9' : '#3b82f6'
    }
    
    update() {
      this.x += this.speedX
      this.y += this.speedY
      
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset()
      }
    }
    
    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.globalAlpha = this.opacity
      ctx.fill()
      ctx.globalAlpha = 1
    }
  }
  
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle())
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    particles.forEach((particle) => {
      particle.update()
      particle.draw()
    })
    
    // Draw connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach((p2) => {
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 120) {
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(14, 165, 233, ${0.1 * (1 - dist / 120)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })
    })
    
    animationFrame = requestAnimationFrame(animate)
  }
  
  animate()
  
  return () => {
    window.removeEventListener('resize', resize)
    cancelAnimationFrame(animationFrame)
  }
}

const initMouseParallax = () => {
  const visual = visualRef.value
  if (!visual) return
  
  const handleMouseMove = (e) => {
    const rect = visual.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) / centerX
    const deltaY = (e.clientY - centerY) / centerY
    
    document.querySelectorAll('.floating-card').forEach((card, i) => {
      const factor = (i + 1) * 15
      card.style.transform = `translate(${deltaX * factor}px, ${deltaY * factor}px)`
    })
    
    const avatar = visual.querySelector('.avatar-circle')
    if (avatar) {
      avatar.style.transform = `translate(${deltaX * 30}px, ${deltaY * 30}px)`
    }
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  return () => document.removeEventListener('mousemove', handleMouseMove)
}

const statsObserver = ref(null)

onMounted(async () => {
  await nextTick()
  
  const cleanupParticles = initParticles()
  const cleanupParallax = initMouseParallax()
  
  // Observe stats for counter animation
  const statsEl = document.querySelector('.hero-stats')
  if (statsEl) {
    statsObserver.value = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true
          const numbers = entry.target.querySelectorAll('.stat-number')
          numbers.forEach((num, i) => {
            setTimeout(() => {
              animateCounter(num, parseInt(num.dataset.target))
            }, i * 200)
          })
        }
      })
    }, { threshold: 0.5 })
    statsObserver.value.observe(statsEl)
  }
  
  onUnmounted(() => {
    cleanupParticles()
    cleanupParallax()
    statsObserver.value?.disconnect()
  })
})
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: 
    radial-gradient(ellipse at 20% 0%, rgba(14, 165, 233, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 100%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: orbFloat 20s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
  background: radial-gradient(circle, #0ea5e9 0%, transparent 70%);
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  right: -50px;
  background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
  animation-delay: -7s;
}

.orb-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
  animation-delay: -14s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -30px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(20px, 30px) scale(1.05); }
}

.container {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  color: #0ea5e9;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #0ea5e9;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.hero-title {
  line-height: 1.1;
  font-size: clamp(2.5rem, 5vw, 4rem);
}

.hero-title span {
  display: block;
}

.hero-title span:first-child {
  color: var(--color-text);
  font-weight: 600;
}

.text-gradient {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: gradientShift 4s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.social-link {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0ea5e9;
  font-size: 1.25rem;
  margin-right: 0.75rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.social-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  transform: scale(0);
  border-radius: 50%;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}

.social-link:hover {
  color: white;
  border-color: transparent;
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.4);
}

.social-link:hover::before {
  transform: scale(1);
}

.social-link:active {
  transform: translateY(-2px) scale(0.95);
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.stat-item {
  flex: 1;
  min-width: 120px;
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-muted);
  font-weight: 500;
  margin-top: 0.25rem;
}

.hero-visual {
  position: relative;
  height: 100%;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-wrapper {
  position: relative;
  width: 380px;
  height: 380px;
}

.avatar-circle {
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px auto 0;
  box-shadow: 
    0 30px 60px rgba(14, 165, 233, 0.3),
    0 0 0 1px rgba(14, 165, 233, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 2;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.avatar-circle i {
  font-size: 8rem;
  color: white;
  opacity: 0.9;
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.2));
}

.avatar-ring {
  position: absolute;
  border: 2px solid rgba(14, 165, 233, 0.3);
  border-radius: 50%;
  animation: ringRotate 20s linear infinite;
}

.avatar-ring::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  border-radius: 50%;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.8);
}

.ring-2 {
  width: 420px;
  height: 420px;
  top: -20px;
  left: -20px;
  animation-duration: 30s;
  animation-direction: reverse;
  border-color: rgba(59, 130, 246, 0.2);
}

.ring-2::before {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
}

.ring-3 {
  width: 480px;
  height: 480px;
  top: -50px;
  left: -50px;
  animation-duration: 40s;
  border-color: rgba(139, 92, 246, 0.15);
}

.ring-3::before {
  background: linear-gradient(135deg, #8b5cf6, #0ea5e9);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.8);
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.floating-card {
  position: absolute;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: var(--shadow-lg);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1;
}

.floating-card i {
  font-size: 1.5rem;
  color: #0ea5e9;
}

.floating-card span {
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
}

.card-1 { top: 10%; left: -10%; animation: floatCard 6s ease-in-out infinite; }
.card-2 { top: 30%; right: -15%; animation: floatCard 6s ease-in-out infinite 1.5s; }
.card-3 { bottom: 30%; right: -10%; animation: floatCard 6s ease-in-out infinite 3s; }
.card-4 { bottom: 10%; left: -15%; animation: floatCard 6s ease-in-out infinite 4.5s; }

@keyframes floatCard {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-15px) rotate(1deg); }
  50% { transform: translateY(5px) rotate(-1deg); }
  75% { transform: translateY(-10px) rotate(0.5deg); }
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-muted);
  font-size: 0.875rem;
  font-weight: 500;
  animation: bounce 2s ease-in-out infinite;
  z-index: 1;
}

.mouse {
  width: 26px;
  height: 42px;
  border: 2px solid var(--color-border);
  border-radius: 13px;
  position: relative;
}

.wheel {
  width: 4px;
  height: 8px;
  background: var(--color-primary);
  border-radius: 2px;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  animation: wheelScroll 1.5s ease-in-out infinite;
}

@keyframes wheelScroll {
  0% { top: 8px; opacity: 1; }
  100% { top: 26px; opacity: 0; }
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

@media (max-width: 991.98px) {
  .hero-visual {
    display: none;
  }
  
  .hero-stats {
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
<template>
  <section class="hero-section py-5">
    <div class="container">
      <div class="row align-items-center min-vh-75">
        <div class="col-lg-6 fade-in">
          <h1 class="display-4 fw-bold mb-3">
            Hi, I'm <span class="text-gradient">{{ profile.name }}</span>
          </h1>
          <h2 class="h3 text-muted mb-4">
            {{ profile.title }}
          </h2>
          <p class="lead mb-4">
            {{ profile.tagline }}
          </p>
          <div class="d-flex gap-3">
            <a href="#contact" class="btn btn-primary btn-lg">
              <i class="bi bi-envelope me-2" />Contact Me
            </a>
            <a href="#projects" class="btn btn-outline-primary btn-lg">
              <i class="bi bi-folder2-open me-2" />View Projects
            </a>
          </div>
          <div class="social-links mt-4">
            <a
              v-if="profile.socialLinks.github"
              :href="profile.socialLinks.github"
              target="_blank"
              class="social-link"
            >
              <i class="bi bi-github" />
            </a>
            <a
              v-if="profile.socialLinks.linkedin"
              :href="profile.socialLinks.linkedin"
              target="_blank"
              class="social-link"
            >
              <i class="bi bi-linkedin" />
            </a>
            <a
              v-if="profile.socialLinks.twitter"
              :href="profile.socialLinks.twitter"
              target="_blank"
              class="social-link"
            >
              <i class="bi bi-twitter-x" />
            </a>
          </div>
        </div>
        <div class="col-lg-6 text-center d-none d-lg-block">
          <div class="hero-image">
            <div class="avatar-circle">
              <i class="bi bi-person" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { usePortfolioStore } from '../../stores/portfolioStore'

const portfolioStore = usePortfolioStore()
const { profile } = portfolioStore
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%);
  animation: pulse 6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.text-gradient {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-image {
  position: relative;
  z-index: 1;
}

.avatar-circle {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 20px 60px rgba(14, 165, 233, 0.3);
}

.avatar-circle i {
  font-size: 8rem;
  color: white;
  opacity: 0.9;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0ea5e9;
  font-size: 1.2rem;
  margin-right: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.social-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(14, 165, 233, 0.3);
  color: white;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
}
</style>
<template>
  <div class="portfolio-layout">
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container">
        <router-link class="navbar-brand" to="/portfolio">
          <i class="bi bi-code-square text-primary me-2" />
          Bogi Page
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#portfolioNav"
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div id="portfolioNav" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/portfolio">
                Home
              </router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#about">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#skills">Skills</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#projects">Projects</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#contact">Contact</a>
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
</script>

<style scoped>
.portfolio-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
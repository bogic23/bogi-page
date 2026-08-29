<template>
  <div class="learning-layout">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/learning">
          <i class="bi bi-mortarboard-fill text-primary me-2" />
          Learning Center
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#learningNav"
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div id="learningNav" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/learning/courses">
                Courses
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard">
                <i class="bi bi-arrow-left me-1" />
                Back to Dashboard
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    <router-view />
  </div>
</template>

<script setup>
</script>

<style scoped>
.learning-layout {
  min-height: 100vh;
  background-color: var(--color-background);
}
</style>
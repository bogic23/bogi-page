<template>
  <div id="app">
    <PageLoader />
    <ScrollProgress />
    <PageTransition>
      <router-view />
    </PageTransition>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from './stores/appStore'
import ScrollProgress from './components/common/ScrollProgress.vue'
import PageTransition from './components/common/PageTransition.vue'
import PageLoader from './components/common/PageLoader.vue'

const appStore = useAppStore()

onMounted(() => {
  appStore.initializeApp()
})
</script>

<style>
#app {
  min-height: 100vh;
  position: relative;
}
</style>
<template>
  <div id="app">
    <PageLoader v-if="authLoading" />
    <template v-else>
      <ScrollProgress />
      <router-view v-slot="{ Component }">
        <PageTransition>
          <component :is="Component" />
        </PageTransition>
      </router-view>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAppStore } from './stores/appStore'
import { useAuthStore } from './stores/authStore'
import ScrollProgress from './components/common/ScrollProgress.vue'
import PageTransition from './components/common/PageTransition.vue'
import PageLoader from './components/common/PageLoader.vue'

const appStore = useAppStore()
const authStore = useAuthStore()

const authLoading = ref(true)

onMounted(async () => {
  appStore.initializeApp()
  await authStore.initAuth()
  authLoading.value = false
})
</script>

<style>
#app {
  min-height: 100vh;
  position: relative;
}
</style>
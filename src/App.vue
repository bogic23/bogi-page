<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from './stores/appStore'

const appStore = useAppStore()

onMounted(() => {
  appStore.initializeApp()
})
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
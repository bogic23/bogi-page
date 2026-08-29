import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { portfolioData } from '../data/portfolio'

export const usePortfolioStore = defineStore('portfolio', () => {
  // State
  const profile = ref(portfolioData.profile)
  const skills = ref(portfolioData.skills)
  const projects = ref(portfolioData.projects)
  const experience = ref(portfolioData.experience)
  const education = ref(portfolioData.education)
  const musicInterests = ref(portfolioData.musicInterests)
  
  // Getters
  const frontendSkills = computed(() => 
    skills.value.filter(s => s.category === 'Frontend')
  )
  
  const backendSkills = computed(() => 
    skills.value.filter(s => s.category === 'Backend' || s.category === 'Database')
  )
  
  const musicSkills = computed(() => 
    skills.value.filter(s => s.category === 'Music')
  )
  
  const featuredProjects = computed(() => 
    projects.value.filter(p => p.featured).slice(0, 3)
  )
  
  return {
    // State
    profile,
    skills,
    projects,
    experience,
    education,
    musicInterests,
    // Getters
    frontendSkills,
    backendSkills,
    musicSkills,
    featuredProjects
  }
})
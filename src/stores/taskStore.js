import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tasks as mockTasks } from '../data/tasks'

export const useTaskStore = defineStore('tasks', () => {
  // State
  const tasks = ref([...mockTasks])
  const filters = ref({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'dueDate'
  })
  
  // Getters
  const incompleteTasks = computed(() => tasks.value.filter(t => !t.completed))
  const completedTasks = computed(() => tasks.value.filter(t => t.completed))
  
  const filteredTasks = computed(() => {
    let filtered = [...tasks.value]
    
    // Search
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase()
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      )
    }
    
    // Status filter
    if (filters.value.status === 'active') {
      filtered = filtered.filter(t => !t.completed)
    } else if (filters.value.status === 'completed') {
      filtered = filtered.filter(t => t.completed)
    }
    
    // Priority filter
    if (filters.value.priority !== 'all') {
      filtered = filtered.filter(t => t.priority === filters.value.priority)
    }
    
    // Category filter
    if (filters.value.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.value.category)
    }
    
    // Sorting
    const sortBy = filters.value.sortBy
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate)
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        case 'title':
          return a.title.localeCompare(b.title)
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt)
        default:
          return 0
      }
    })
    
    return filtered
  })
  
  const categories = computed(() => {
    const cats = new Set(tasks.value.map(t => t.category))
    return Array.from(cats)
  })
  
  // Actions
  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString(),
      ...task
    }
    tasks.value.unshift(newTask)
    return newTask
  }
  
  const updateTask = (id, updates) => {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates }
    }
  }
  
  const deleteTask = (id) => {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }
  
  const toggleTaskComplete = (id) => {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      task.completedAt = task.completed ? new Date().toISOString() : null
    }
  }
  
  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }
  
  return {
    // State
    tasks,
    filters,
    // Getters
    incompleteTasks,
    completedTasks,
    filteredTasks,
    categories,
    // Actions
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    setFilters
  }
})
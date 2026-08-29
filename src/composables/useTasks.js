import { computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'

export function useTasks() {
  const taskStore = useTaskStore()
  
  const stats = computed(() => {
    const total = taskStore.tasks.length
    const completed = taskStore.completedTasks.length
    const active = taskStore.incompleteTasks.length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return {
      total,
      completed,
      active,
      completionRate
    }
  })
  
  const getTasksByCategory = (category) => {
    return taskStore.tasks.filter(task => task.category === category)
  }
  
  const getTasksByPriority = (priority) => {
    return taskStore.tasks.filter(task => task.priority === priority)
  }
  
  const getOverdueTasks = () => {
    const now = new Date()
    return taskStore.incompleteTasks.filter(task => new Date(task.dueDate) < now)
  }
  
  const getDueSoonTasks = (days = 3) => {
    const now = new Date()
    const future = new Date(now)
    future.setDate(future.getDate() + days)
    
    return taskStore.incompleteTasks.filter(task => {
      const dueDate = new Date(task.dueDate)
      return dueDate >= now && dueDate <= future
    })
  }
  
  return {
    stats,
    getTasksByCategory,
    getTasksByPriority,
    getOverdueTasks,
    getDueSoonTasks
  }
}
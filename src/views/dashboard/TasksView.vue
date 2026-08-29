<template>
  <div class="tasks-view">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1">
          Tasks
        </h2>
        <p class="text-muted mb-0">
          Manage your tasks and stay productive
        </p>
      </div>
      <AppButton variant="primary" icon="plus-lg" @click="openCreateModal">
        Add Task
      </AppButton>
    </div>
    
    <!-- Filters -->
    <AppCard class="mb-4">
      <div class="row g-3">
        <div class="col-md-4">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search" /></span>
            <input 
              v-model="searchInput" 
              type="text" 
              class="form-control" 
              placeholder="Search tasks..."
              @input="debouncedSearch"
            >
          </div>
        </div>
        <div class="col-md-2">
          <select v-model="filters.status" class="form-select" @change="applyFilters">
            <option value="all">
              All Status
            </option>
            <option value="active">
              Active
            </option>
            <option value="completed">
              Completed
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <select v-model="filters.priority" class="form-select" @change="applyFilters">
            <option value="all">
              All Priorities
            </option>
            <option value="high">
              High
            </option>
            <option value="medium">
              Medium
            </option>
            <option value="low">
              Low
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <select v-model="filters.category" class="form-select" @change="applyFilters">
            <option value="all">
              All Categories
            </option>
            <option v-for="category in taskStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <select v-model="filters.sortBy" class="form-select" @change="applyFilters">
            <option value="dueDate">
              Sort by Due Date
            </option>
            <option value="priority">
              Sort by Priority
            </option>
            <option value="title">
              Sort by Title
            </option>
            <option value="createdAt">
              Sort by Created Date
            </option>
          </select>
        </div>
      </div>
    </AppCard>
    
    <!-- Task Stats -->
    <div class="row mb-4">
      <div class="col-md-4">
        <AppCard variant="primary">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h3 class="h4 mb-0">
                {{ taskStore.incompleteTasks.length }}
              </h3>
              <p class="text-muted mb-0">
                Active Tasks
              </p>
            </div>
            <i class="bi bi-clock-history fs-3 text-primary" />
          </div>
        </AppCard>
      </div>
      <div class="col-md-4">
        <AppCard variant="success">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h3 class="h4 mb-0">
                {{ taskStore.completedTasks.length }}
              </h3>
              <p class="text-muted mb-0">
                Completed
              </p>
            </div>
            <i class="bi bi-check-circle fs-3 text-success" />
          </div>
        </AppCard>
      </div>
      <div class="col-md-4">
        <AppCard variant="warning">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h3 class="h4 mb-0">
                {{ completionRate }}%
              </h3>
              <p class="text-muted mb-0">
                Completion Rate
              </p>
            </div>
            <i class="bi bi-graph-up fs-3 text-warning" />
          </div>
        </AppCard>
      </div>
    </div>
    
    <!-- Task List -->
    <div v-if="taskStore.filteredTasks.length">
      <TaskCard 
        v-for="task in taskStore.filteredTasks" 
        :key="task.id"
        :task="task"
        @toggle="handleToggleTask"
        @edit="openEditModal"
        @delete="handleDeleteTask"
      />
    </div>
    <AppCard v-else>
      <div class="text-center py-5">
        <i class="bi bi-inbox fs-1 text-muted" />
        <h5 class="mt-3">
          No tasks found
        </h5>
        <p class="text-muted">
          Try adjusting your filters or create a new task
        </p>
        <AppButton variant="primary" icon="plus-lg" @click="openCreateModal">
          Create Task
        </AppButton>
      </div>
    </AppCard>
    
    <!-- Create/Edit Modal -->
    <AppModal 
      v-model="showModal" 
      :title="editingTask ? 'Edit Task' : 'Create New Task'"
      size="lg"
    >
      <TaskForm 
        :task="editingTask"
        @submit="handleTaskSubmit"
        @cancel="closeModal"
      />
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '../../stores/taskStore'
import { useAppStore } from '../../stores/appStore'
import AppCard from '../../components/common/AppCard.vue'
import AppButton from '../../components/common/AppButton.vue'
import AppModal from '../../components/common/AppModal.vue'
import TaskCard from '../../components/tasks/TaskCard.vue'
import TaskForm from '../../components/tasks/TaskForm.vue'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const appStore = useAppStore()

const showModal = ref(false)
const editingTask = ref(null)
const searchInput = ref('')
const filters = ref({
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  sortBy: 'dueDate'
})

let searchTimeout

const completionRate = computed(() => {
  if (taskStore.tasks.length === 0) return 0
  return Math.round((taskStore.completedTasks.length / taskStore.tasks.length) * 100)
})

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filters.value.search = searchInput.value
    applyFilters()
  }, 300)
}

const applyFilters = () => {
  taskStore.setFilters(filters.value)
}

const openCreateModal = () => {
  editingTask.value = null
  showModal.value = true
}

const openEditModal = (task) => {
  editingTask.value = task
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingTask.value = null
}

const handleTaskSubmit = (taskData) => {
  if (editingTask.value) {
    taskStore.updateTask(editingTask.value.id, taskData)
    appStore.addNotification({
      title: 'Task Updated',
      message: `"${taskData.title}" has been updated successfully`
    })
  } else {
    const newTask = taskStore.addTask(taskData)
    appStore.addNotification({
      title: 'Task Created',
      message: `"${newTask.title}" has been created`
    })
  }
  closeModal()
}

const handleToggleTask = (taskId) => {
  taskStore.toggleTaskComplete(taskId)
  const task = taskStore.tasks.find(t => t.id === taskId)
  if (task?.completed) {
    appStore.addNotification({
      title: 'Task Completed',
      message: `"${task.title}" has been marked as complete`
    })
  }
}

const handleDeleteTask = (taskId) => {
  const task = taskStore.tasks.find(t => t.id === taskId)
  if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
    taskStore.deleteTask(taskId)
    appStore.addNotification({
      title: 'Task Deleted',
      message: `"${task.title}" has been deleted`
    })
  }
}

onMounted(() => {
  // Check if we should open the create modal from query params
  if (route.query.action === 'add') {
    openCreateModal()
    router.replace('/tasks')
  }
  
  // Initialize filters
  taskStore.setFilters(filters.value)
})
</script>
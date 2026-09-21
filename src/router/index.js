import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import PortfolioLayout from '../layouts/PortfolioLayout.vue'
import LearningLayout from '../layouts/LearningLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      component: PortfolioLayout,
      children: [
        {
          path: '',
          name: 'portfolio',
          component: () => import('../views/portfolio/PortfolioView.vue')
        },
        {
          path: 'qr-generator',
          name: 'qr-generator',
          component: () => import('../views/portfolio/QRCodeGeneratorView.vue')
        }
      ]
    },
    {
      path: '/portfolio',
      redirect: '/'
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/dashboard/DashboardView.vue')
        },
        {
          path: 'tasks',
          name: 'tasks',
          component: () => import('../views/dashboard/TasksView.vue')
        },
        {
          path: 'calendar',
          name: 'calendar',
          component: () => import('../views/dashboard/CalendarView.vue')
        },
        {
          path: 'notes',
          name: 'notes',
          component: () => import('../views/dashboard/NotesView.vue')
        },
        {
          path: 'activity',
          name: 'activity',
          component: () => import('../views/dashboard/MyActivityView.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/settings/SettingsView.vue')
        },
        {
          path: 'scores',
          name: 'scores',
          component: () => import('../views/dashboard/MyScoresView.vue')
        }
      ]
    },
    {
      path: '/learning',
      component: LearningLayout,
      children: [
        {
          path: '',
          redirect: '/learning/courses'
        },
        {
          path: 'courses',
          name: 'courses',
          component: () => import('../views/learning/CoursesView.vue')
        },
        {
          path: 'course/:id',
          name: 'course-detail',
          component: () => import('../views/learning/CourseDetailView.vue')
        },
        {
          path: 'course/:id/lesson/:lessonId',
          name: 'lesson',
          component: () => import('../views/learning/LessonView.vue')
        },
        {
          path: 'course/:id/quiz/:quizId',
          name: 'quiz',
          component: () => import('../views/learning/QuizView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth if not already done
  if (authStore.loading) {
    await authStore.initAuth()
  }
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
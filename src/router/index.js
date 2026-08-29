import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import PortfolioLayout from '../layouts/PortfolioLayout.vue'
import LearningLayout from '../layouts/LearningLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/portfolio',
      component: PortfolioLayout,
      children: [
        {
          path: '',
          name: 'portfolio',
          component: () => import('../views/portfolio/PortfolioView.vue')
        }
      ]
    },
    {
      path: '/',
      component: DashboardLayout,
      children: [
        {
          path: 'dashboard',
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
          path: 'settings',
          name: 'settings',
          component: () => import('../views/settings/SettingsView.vue')
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
    }
  ]
})

export default router
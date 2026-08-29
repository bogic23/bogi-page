import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { courses as mockCourses } from '../data/courses'

export const useLearningStore = defineStore('learning', () => {
  // State
  const courses = ref([...mockCourses])
  const currentCourse = ref(null)
  const currentLesson = ref(null)
  const learningProgress = ref({})
  const achievements = ref([
    { id: 1, name: 'First Steps', description: 'Complete your first lesson', icon: 'bi-star', unlocked: true },
    { id: 2, name: 'Quick Learner', description: 'Complete 5 lessons in one day', icon: 'bi-lightning', unlocked: false },
    { id: 3, name: 'Quiz Master', description: 'Score 100% on 3 quizzes', icon: 'bi-trophy', unlocked: false },
    { id: 4, name: 'Course Champion', description: 'Complete an entire course', icon: 'bi-award', unlocked: false },
    { id: 5, name: 'Consistent', description: 'Study for 7 consecutive days', icon: 'bi-calendar-check', unlocked: false }
  ])
  
  // Getters
  const enrolledCourses = computed(() => 
    courses.value.filter(course => course.enrolled)
  )
  
  const activeCourse = computed(() => 
    enrolledCourses.value.find(course => course.progress > 0 && course.progress < 100) || enrolledCourses.value[0]
  )
  
  const totalLessons = computed(() => {
    let total = 0
    courses.value.forEach(course => {
      course.modules?.forEach(module => {
        total += module.lessons?.length || 0
      })
    })
    return total
  })
  
  const completedLessons = computed(() => {
    let completed = 0
    courses.value.forEach(course => {
      course.modules?.forEach(module => {
        module.lessons?.forEach(lesson => {
          if (lesson.completed) completed++
        })
      })
    })
    return completed
  })
  
  const overallProgress = computed(() => {
    if (totalLessons.value === 0) return 0
    return Math.round((completedLessons.value / totalLessons.value) * 100)
  })
  
  // Actions
  const setCurrentCourse = (courseId) => {
    currentCourse.value = courses.value.find(c => c.id === courseId) || null
  }
  
  const setCurrentLesson = (lessonId) => {
    if (!currentCourse.value) return null
    
    for (const module of currentCourse.value.modules) {
      const lesson = module.lessons?.find(l => l.id === lessonId)
      if (lesson) {
        currentLesson.value = lesson
        return lesson
      }
    }
    return null
  }
  
  const completeLesson = (courseId, lessonId) => {
    const course = courses.value.find(c => c.id === courseId)
    if (!course) return
    
    for (const module of course.modules) {
      const lesson = module.lessons?.find(l => l.id === lessonId)
      if (lesson) {
        lesson.completed = true
        updateCourseProgress(course)
        break
      }
    }
  }
  
  const updateCourseProgress = (course) => {
    let total = 0
    let completed = 0
    
    course.modules?.forEach(module => {
      module.lessons?.forEach(lesson => {
        total++
        if (lesson.completed) completed++
      })
    })
    
    course.progress = total > 0 ? Math.round((completed / total) * 100) : 0
  }
  
  const enrollInCourse = (courseId) => {
    const course = courses.value.find(c => c.id === courseId)
    if (course) {
      course.enrolled = true
      course.progress = 0
    }
  }
  
  const submitQuiz = (courseId, quizId, answers) => {
    const course = courses.value.find(c => c.id === courseId)
    if (!course) return null
    
    let quiz = null
    let score = 0
    let totalQuestions = 0
    
    for (const module of course.modules) {
      for (const lesson of module.lessons || []) {
        if (lesson.quiz && lesson.quiz.id === quizId) {
          quiz = lesson.quiz
          totalQuestions = quiz.questions.length
          
          quiz.questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
              score++
            }
          })
          break
        }
      }
    }
    
    if (quiz) {
      const percentage = Math.round((score / totalQuestions) * 100)
      if (percentage >= 70) {
        // Mark the quiz lesson as complete
        for (const module of course.modules) {
          const lesson = module.lessons?.find(l => l.quiz?.id === quizId)
          if (lesson) {
            lesson.completed = true
            updateCourseProgress(course)
            break
          }
        }
      }
      
      return {
        score,
        totalQuestions,
        percentage,
        passed: percentage >= 70
      }
    }
    
    return null
  }
  
  const getCourseById = (courseId) => {
    return courses.value.find(c => c.id === courseId)
  }
  
  const getLessonById = (courseId, lessonId) => {
    const course = getCourseById(courseId)
    if (!course) return null
    
    for (const module of course.modules) {
      const lesson = module.lessons?.find(l => l.id === lessonId)
      if (lesson) return lesson
    }
    return null
  }
  
  return {
    // State
    courses,
    currentCourse,
    currentLesson,
    learningProgress,
    achievements,
    // Getters
    enrolledCourses,
    activeCourse,
    totalLessons,
    completedLessons,
    overallProgress,
    // Actions
    setCurrentCourse,
    setCurrentLesson,
    completeLesson,
    enrollInCourse,
    submitQuiz,
    getCourseById,
    getLessonById
  }
})
<template>
  <div class="quiz-view py-5">
    <div class="container">
      <div v-if="quiz" class="row justify-content-center">
        <div class="col-lg-8">
          <!-- Header -->
          <div class="mb-4">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/learning/courses">
                    Courses
                  </router-link>
                </li>
                <li class="breadcrumb-item">
                  <router-link :to="`/learning/course/${courseId}`">
                    Course
                  </router-link>
                </li>
                <li class="breadcrumb-item active">
                  Quiz
                </li>
              </ol>
            </nav>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h1 class="h3 mb-1">
                  {{ quiz.title || 'Quiz' }}
                </h1>
                <p class="text-muted mb-0">
                  {{ quiz.description || 'Test your knowledge' }}
                </p>
              </div>
              <div v-if="showTimer" class="quiz-timer">
                <i class="bi bi-clock me-1" />
                <span class="fw-bold" :class="timeRemaining < 60 ? 'text-danger' : ''">
                  {{ formatTime(timeRemaining) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mb-4">
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Question {{ currentQuestionIndex + 1 }} of {{ quiz.questions.length }}</span>
              <span class="text-muted">{{ Math.round(progress) }}%</span>
            </div>
            <div class="progress" style="height: 8px;">
              <div 
                class="progress-bar bg-gradient-primary" 
                :style="{ width: progress + '%' }"
              />
            </div>
          </div>

          <!-- Question -->
          <AppCard v-if="!quizSubmitted" class="mb-4">
            <div class="card-body p-4">
              <h5 class="mb-4">
                {{ currentQuestion.question }}
              </h5>
              
              <div class="quiz-options">
                <div 
                  v-for="(option, index) in currentQuestion.options" 
                  :key="index"
                  class="quiz-option mb-3"
                >
                  <button
                    type="button"
                    class="btn w-100 text-start p-4"
                    :class="{
                      'btn-outline-primary': selectedAnswer !== index,
                      'btn-primary': selectedAnswer === index,
                      'btn-success': showResults && index === currentQuestion.correctAnswer,
                      'btn-danger': showResults && selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer
                    }"
                    :disabled="showResults"
                    @click="selectAnswer(index)"
                  >
                    <div class="d-flex align-items-center">
                      <span class="option-letter me-3 fw-bold">
                        {{ String.fromCharCode(65 + index) }}.
                      </span>
                      <span class="flex-grow-1">{{ option }}</span>
                      <i 
                        v-if="showResults && index === currentQuestion.correctAnswer" 
                        class="bi bi-check-circle-fill text-success ms-2"
                      />
                      <i 
                        v-if="showResults && selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer" 
                        class="bi bi-x-circle-fill text-danger ms-2"
                      />
                    </div>
                  </button>
                </div>
              </div>

              <!-- Explanation -->
              <div v-if="showResults && currentQuestion.explanation" class="mt-4 p-3 bg-light rounded">
                <h6 class="mb-2">
                  <i class="bi bi-lightbulb me-1" />Explanation
                </h6>
                <p class="mb-0">
                  {{ currentQuestion.explanation }}
                </p>
              </div>
            </div>
          </AppCard>

          <!-- Navigation -->
          <div v-if="!quizSubmitted" class="d-flex justify-content-between mb-4">
            <button 
              class="btn btn-light"
              :disabled="currentQuestionIndex === 0"
              @click="previousQuestion"
            >
              <i class="bi bi-arrow-left me-1" />Previous
            </button>
            <div class="d-flex gap-2">
              <button 
                v-if="currentQuestionIndex < quiz.questions.length - 1"
                class="btn btn-primary"
                :disabled="selectedAnswer === null"
                @click="nextQuestion"
              >
                Next<i class="bi bi-arrow-right ms-1" />
              </button>
              <button 
                v-else
                class="btn btn-success"
                :disabled="selectedAnswer === null"
                @click="submitQuiz"
              >
                <i class="bi bi-check-circle me-1" />Submit Quiz
              </button>
            </div>
          </div>

          <!-- Results -->
          <AppCard v-if="quizSubmitted" class="mb-4">
            <div class="card-body p-5 text-center">
              <div class="mb-4">
                <div 
                  class="result-icon mx-auto mb-3" 
                  :class="passed ? 'text-success' : 'text-danger'"
                >
                  <i :class="passed ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'" style="font-size: 4rem;" />
                </div>
                <h2 class="mb-2">
                  {{ passed ? 'Congratulations!' : 'Keep Trying!' }}
                </h2>
                <p class="text-muted mb-0">
                  You scored {{ score }} out of {{ totalQuestions }} ({{ percentage }}%)
                </p>
              </div>

              <div class="row text-center mb-4">
                <div class="col-4">
                  <div class="fs-3 fw-bold text-success">
                    {{ correctCount }}
                  </div>
                  <small class="text-muted">Correct</small>
                </div>
                <div class="col-4">
                  <div class="fs-3 fw-bold text-danger">
                    {{ incorrectCount }}
                  </div>
                  <small class="text-muted">Incorrect</small>
                </div>
                <div class="col-4">
                  <div class="fs-3 fw-bold text-warning">
                    {{ unansweredCount }}
                  </div>
                  <small class="text-muted">Unanswered</small>
                </div>
              </div>

              <div class="d-flex gap-2 justify-content-center flex-wrap">
                <button 
                  class="btn btn-primary"
                  @click="retakeQuiz"
                >
                  <i class="bi bi-arrow-clockwise me-1" />Retake Quiz
                </button>
                <button 
                  class="btn btn-outline-primary"
                  @click="goToCourse"
                >
                  <i class="bi bi-book me-1" />Back to Course
                </button>
                <button 
                  v-if="passed && !lessonCompleted"
                  class="btn btn-success"
                  @click="completeLesson"
                >
                  <i class="bi bi-check-circle me-1" />Mark Lesson Complete
                </button>
              </div>
            </div>
          </AppCard>

          <!-- Question Review -->
          <AppCard v-if="quizSubmitted && showReview" class="mb-4">
            <div class="card-body p-4">
              <h5 class="mb-3">
                Question Review
              </h5>
              <div id="quizReview" class="accordion">
                <div v-for="(question, qIndex) in quiz.questions" :key="qIndex" class="accordion-item">
                  <h2 class="accordion-header">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      :data-bs-target="`#question${qIndex}`"
                    >
                      <span class="me-2" :class="userAnswers[qIndex] === question.correctAnswer ? 'text-success' : 'text-danger'">
                        <i :class="userAnswers[qIndex] === question.correctAnswer ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'" />
                      </span>
                      Question {{ qIndex + 1 }}: {{ question.question }}
                    </button>
                  </h2>
                  <div :id="`question${qIndex}`" class="accordion-collapse collapse" data-bs-parent="#quizReview">
                    <div class="accordion-body">
                      <div
                        v-for="(option, oIndex) in question.options"
                        :key="oIndex"
                        class="mb-2 p-2"
                        :class="getOptionClass(qIndex, oIndex, question.correctAnswer)"
                      >
                        <div class="d-flex align-items-center">
                          <span class="option-letter me-3 fw-bold">{{ String.fromCharCode(65 + oIndex) }}.</span>
                          <span>{{ option }}</span>
                          <i 
                            v-if="oIndex === question.correctAnswer" 
                            class="bi bi-check-circle-fill text-success ms-auto"
                          />
                        </div>
                      </div>
                      <div v-if="question.explanation" class="mt-3 p-3 bg-light rounded">
                        <strong>Explanation:</strong> {{ question.explanation }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <AppCard class="max-w-md mx-auto">
          <i class="bi bi-exclamation-triangle fs-1 text-warning mb-3" />
          <h5>Quiz Not Found</h5>
          <p class="text-muted">
            The requested quiz could not be found.
          </p>
          <router-link to="/learning/courses" class="btn btn-primary">
            <i class="bi bi-arrow-left me-1" />Back to Courses
          </router-link>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLearningStore } from '../../stores/learningStore'
import { useAppStore } from '../../stores/appStore'
import AppCard from '../../components/common/AppCard.vue'

const route = useRoute()
const router = useRouter()
const learningStore = useLearningStore()
const appStore = useAppStore()

const courseId = parseInt(route.params.id)
const quizId = parseInt(route.params.quizId)

const quiz = ref(null)
const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)
const userAnswers = ref({})
const quizSubmitted = ref(false)
const showTimer = ref(true)
const timeRemaining = ref(0)
const showReview = ref(true)

let timerInterval = null

const currentQuestion = computed(() => {
  if (!quiz.value || !quiz.value.questions.length) return null
  return quiz.value.questions[currentQuestionIndex.value]
})

const progress = computed(() => {
  if (!quiz.value || !quiz.value.questions.length) return 0
  return ((currentQuestionIndex.value + 1) / quiz.value.questions.length) * 100
})

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const startTimer = () => {
  timeRemaining.value = 15 * 60 // 15 minutes
  timerInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      submitQuiz()
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const selectAnswer = (index) => {
  selectedAnswer.value = index
  userAnswers.value[currentQuestionIndex.value] = index
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < quiz.value.questions.length - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = userAnswers.value[currentQuestionIndex.value] ?? null
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedAnswer.value = userAnswers.value[currentQuestionIndex.value] ?? null
  }
}

const submitQuiz = () => {
  stopTimer()
  const result = learningStore.submitQuiz(courseId, quizId, userAnswers.value)
  
  if (result) {
    quizSubmitted.value = true
    if (result.passed) {
      appStore.addNotification({
        title: 'Quiz Passed!',
        message: `You scored ${result.percentage}% on the quiz`
      })
    } else {
      appStore.addNotification({
        title: 'Quiz Failed',
        message: `You scored ${result.percentage}%. You need 70% to pass.`
      })
    }
  }
}

const retakeQuiz = () => {
  quizSubmitted.value = false
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  userAnswers.value = {}
  startTimer()
}

const goToCourse = () => {
  router.push(`/learning/course/${courseId}`)
}

const completeLesson = () => {
  learningStore.completeLesson(courseId, getCurrentLessonId())
  appStore.addNotification({
    title: 'Lesson Completed',
    message: 'Quiz lesson marked as complete!'
  })
  router.push(`/learning/course/${courseId}`)
}

const getCurrentLessonId = () => {
  if (!learningStore.currentCourse) return null
  for (const module of learningStore.currentCourse.modules) {
    const lesson = module.lessons?.find(l => l.quiz?.id === quizId)
    if (lesson) return lesson.id
  }
  return null
}

const lessonCompleted = computed(() => {
  const lessonId = getCurrentLessonId()
  if (!lessonId) return false
  
  for (const module of learningStore.currentCourse?.modules || []) {
    const lesson = module.lessons?.find(l => l.id === lessonId)
    if (lesson) return lesson.completed
  }
  return false
})

const score = computed(() => {
  if (!quiz.value) return 0
  return Object.values(userAnswers.value).filter((ans, idx) => 
    ans === quiz.value.questions[idx]?.correctAnswer
  ).length
})

const totalQuestions = computed(() => quiz.value?.questions.length || 0)
const percentage = computed(() => totalQuestions.value > 0 ? Math.round((score.value / totalQuestions.value) * 100) : 0)
const passed = computed(() => percentage.value >= 70)

const correctCount = computed(() => score.value)
const incorrectCount = computed(() => {
  return Object.values(userAnswers.value).filter((ans, idx) => 
    ans !== null && ans !== quiz.value?.questions[idx]?.correctAnswer
  ).length
})
const unansweredCount = computed(() => {
  return quiz.value?.questions.length - Object.keys(userAnswers.value).length
})

const getOptionClass = (qIndex, oIndex, correctAnswer) => {
  const userAns = userAnswers.value[qIndex]
  if (oIndex === correctAnswer) return 'bg-success-subtle border border-success'
  if (userAns === oIndex && userAns !== correctAnswer) return 'bg-danger-subtle border border-danger'
  return ''
}

onMounted(() => {
  learningStore.setCurrentCourse(courseId)
  
  // Find the quiz
  const course = learningStore.getCourseById(courseId)
  if (course) {
    for (const module of course.modules) {
      for (const lesson of module.lessons || []) {
        if (lesson.quiz && lesson.quiz.id === quizId) {
          quiz.value = lesson.quiz
          break
        }
      }
    }
  }
  
  if (quiz.value) {
    startTimer()
  }
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.quiz-option button {
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.quiz-option button:hover:not(:disabled) {
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

.quiz-option .btn-primary {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: white;
}

.quiz-timer {
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  background: rgba(14, 165, 233, 0.1);
  border-radius: var(--radius-lg);
}

.result-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.accordion-button:not(.collapsed) {
  background-color: rgba(14, 165, 233, 0.1);
  color: var(--color-primary);
}

.accordion-button:focus {
  box-shadow: none;
  border-color: var(--color-primary);
}
</style>
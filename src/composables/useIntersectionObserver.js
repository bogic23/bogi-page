import { ref, onMounted, onUnmounted } from 'vue'

export function useIntersectionObserver(options = {}) {
  const {
    root = null,
    rootMargin = '0px 0px -50px 0px',
    threshold = 0.1,
    triggerOnce = true,
  } = options

  const elementRef = ref(null)
  const isIntersecting = ref(false)
  const hasTriggered = ref(false)

  let observer = null

  const initObserver = () => {
    if (!elementRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersecting.value = true
            hasTriggered.value = true
            if (triggerOnce && observer) {
              observer.unobserve(elementRef.value)
            }
          } else if (!triggerOnce) {
            isIntersecting.value = false
          }
        })
      },
      { root, rootMargin, threshold }
    )

    observer.observe(elementRef.value)
  }

  onMounted(() => {
    initObserver()
  })

  onUnmounted(() => {
    if (observer && elementRef.value) {
      observer.unobserve(elementRef.value)
    }
    observer = null
  })

  return {
    elementRef,
    isIntersecting,
    hasTriggered,
  }
}

export function useIntersectionObserverMultiple(elements, options = {}) {
  const {
    root = null,
    rootMargin = '0px 0px -50px 0px',
    threshold = 0.1,
    triggerOnce = true,
  } = options

  const observer = ref(null)
  const states = ref(new Map())

  const initObserver = () => {
    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target
          const wasIntersecting = states.value.get(target)?.isIntersecting ?? false

          if (entry.isIntersecting && !wasIntersecting) {
            states.value.set(target, {
              isIntersecting: true,
              hasTriggered: true,
              time: Date.now(),
            })
            if (triggerOnce) {
              observer.value?.unobserve(target)
            }
          } else if (!triggerOnce && !entry.isIntersecting) {
            states.value.set(target, {
              isIntersecting: false,
              hasTriggered: false,
              time: Date.now(),
            })
          }
        })
      },
      { root, rootMargin, threshold }
    )

    elements.forEach((el) => {
      if (el.value) {
        states.value.set(el.value, {
          isIntersecting: false,
          hasTriggered: false,
          time: 0,
        })
        observer.value.observe(el.value)
      }
    })
  }

  onMounted(() => {
    initObserver()
  })

  onUnmounted(() => {
    observer.value?.disconnect()
  })

  const getState = (element) => states.value.get(element) || { isIntersecting: false, hasTriggered: false }

  return {
    observer,
    states,
    getState,
  }
}
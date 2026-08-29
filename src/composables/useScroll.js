import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollProgress() {
  const scrollProgress = ref(0)
  const scrollDirection = ref('down')
  const lastScrollTop = ref(0)
  const isScrolling = ref(false)
  let scrollTimeout = null

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

    scrollProgress.value = Math.max(0, Math.min(100, progress))

    if (scrollTop > lastScrollTop.value) {
      scrollDirection.value = 'down'
    } else if (scrollTop < lastScrollTop.value) {
      scrollDirection.value = 'up'
    }
    lastScrollTop.value = scrollTop

    isScrolling.value = true
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      isScrolling.value = false
    }, 150)
  }

  onMounted(() => {
    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    updateScrollProgress()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateScrollProgress)
    clearTimeout(scrollTimeout)
  })

  return {
    scrollProgress,
    scrollDirection,
    isScrolling,
  }
}

export function useParallax(speed = 0.5) {
  const transform = ref('translateY(0px)')

  const updateParallax = () => {
    const scrollY = window.scrollY
    transform.value = `translateY(${scrollY * speed}px)`
  }

  onMounted(() => {
    window.addEventListener('scroll', updateParallax, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateParallax)
  })

  return { transform }
}

export function useMouseParallax(intensity = 20) {
  const transform = ref('translate(0px, 0px) rotateX(0deg) rotateY(0deg)')

  const updateMouseParallax = (e) => {
    const { clientX, clientY } = e
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const deltaX = (clientX - centerX) / centerX
    const deltaY = (clientY - centerY) / centerY

    const rotateY = deltaX * intensity * 0.5
    const rotateX = -deltaY * intensity * 0.5
    const translateX = deltaX * intensity
    const translateY = deltaY * intensity

    transform.value = `translate(${translateX}px, ${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  onMounted(() => {
    window.addEventListener('mousemove', updateMouseParallax, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', updateMouseParallax)
  })

  return { transform }
}
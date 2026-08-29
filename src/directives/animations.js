// No Vue imports needed for directives

const revealElements = new Map()

const defaultOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
  triggerOnce: true,
  delay: 0,
  duration: 600,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
}

function createObserver(options) {
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target
      const data = revealElements.get(element)

      if (!data) return

      if (entry.isIntersecting) {
        setTimeout(() => {
          element.style.transition = `opacity ${data.duration}ms ${data.easing}, transform ${data.duration}ms ${data.easing}`
          element.style.opacity = '1'
          element.style.transform = 'translateY(0) scale(1)'
          element.classList.add('revealed')
        }, data.delay)

        if (data.triggerOnce) {
          observer.unobserve(element)
          revealElements.delete(element)
        }
      } else if (!data.triggerOnce) {
        element.style.opacity = '0'
        element.style.transform = data.initialTransform
        element.classList.remove('revealed')
      }
    })
  }, {
    threshold: options.threshold,
    rootMargin: options.rootMargin,
  })
}

const observer = createObserver(defaultOptions)

export const vReveal = {
  mounted(el, binding) {
    const options = {
      ...defaultOptions,
      ...binding.value,
    }

    const initialTransform = binding.value?.transform || 'translateY(30px)'
    const initialOpacity = binding.value?.opacity ?? 0

    el.style.opacity = initialOpacity
    el.style.transform = initialTransform
    el.style.willChange = 'opacity, transform'

    revealElements.set(el, {
      ...options,
      initialTransform,
      initialOpacity,
    })

    observer.observe(el)
  },
  unmounted(el) {
    observer.unobserve(el)
    revealElements.delete(el)
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      const options = {
        ...defaultOptions,
        ...binding.value,
      }
      revealElements.set(el, {
        ...revealElements.get(el),
        ...options,
      })
    }
  },
}

export const vStagger = {
  mounted(el, binding) {
    const children = Array.from(el.children)
    const delay = binding.value?.delay || 100
    const duration = binding.value?.duration || 600
    const easing = binding.value?.easing || 'cubic-bezier(0.16, 1, 0.3, 1)'
    const transform = binding.value?.transform || 'translateY(30px)'
    const opacity = binding.value?.opacity ?? 0

    children.forEach((child, index) => {
      child.style.opacity = opacity
      child.style.transform = transform
      child.style.transition = `opacity ${duration}ms ${easing} ${index * delay}ms, transform ${duration}ms ${easing} ${index * delay}ms`
      child.style.willChange = 'opacity, transform'
    })

    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          children.forEach((child) => {
            child.style.opacity = '1'
            child.style.transform = 'translateY(0) scale(1)'
          })
          staggerObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

    staggerObserver.observe(el)
    el._staggerObserver = staggerObserver
  },
  unmounted(el) {
    if (el._staggerObserver) {
      el._staggerObserver.disconnect()
    }
  },
}

export const vParallax = {
  mounted(el, binding) {
    const speed = binding.value?.speed || 0.3
    const axis = binding.value?.axis || 'y'
    const invert = binding.value?.invert || false

    const update = () => {
      const scrollY = window.scrollY
      const rect = el.getBoundingClientRect()
      const elementTop = rect.top + scrollY
      const elementHeight = rect.height
      const viewportHeight = window.innerHeight

      const scrollProgress = (scrollY + viewportHeight - elementTop) / (viewportHeight + elementHeight)

      if (scrollProgress >= 0 && scrollProgress <= 1) {
        const offset = (scrollProgress - 0.5) * 2 * speed * 100
        const value = invert ? -offset : offset

        if (axis === 'y' || axis === 'both') {
          el.style.transform = `translateY(${value}px)`
        }
        if (axis === 'x' || axis === 'both') {
          el.style.transform = `translateX(${value}px)`
        }
      }
    }

    el.style.willChange = 'transform'
    window.addEventListener('scroll', update, { passive: true })
    update()

    el._parallaxUpdate = update
  },
  unmounted(el) {
    if (el._parallaxUpdate) {
      window.removeEventListener('scroll', el._parallaxUpdate)
    }
  },
}

export const vRipple = {
  mounted(el, binding) {
    const color = binding.value?.color || 'rgba(255, 255, 255, 0.3)'
    const duration = binding.value?.duration || 400

    el.style.position = 'relative'
    el.style.overflow = 'hidden'

    const createRipple = (e) => {
      const rect = el.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      const ripple = document.createElement('span')
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: ${color};
        border-radius: 50%;
        transform: scale(0);
        animation: ripple ${duration}ms ease-out forwards;
        pointer-events: none;
        z-index: 9999;
      `

      if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style')
        style.id = 'ripple-styles'
        style.textContent = `
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `
        document.head.appendChild(style)
      }

      el.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, duration)
    }

    el.addEventListener('click', createRipple)
    el._rippleHandler = createRipple
  },
  unmounted(el) {
    if (el._rippleHandler) {
      el.removeEventListener('click', el._rippleHandler)
    }
  },
}

export const vMagnetic = {
  mounted(el, binding) {
    const strength = binding.value?.strength || 0.3
    const ease = binding.value?.ease || 'cubic-bezier(0.16, 1, 0.3, 1)'

    const move = (e) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength

      el.style.transition = `transform 0.3s ${ease}`
      el.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    }

    const leave = () => {
      el.style.transition = `transform 0.5s ${ease}`
      el.style.transform = 'translate(0, 0)'
    }

    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)

    el._magneticMove = move
    el._magneticLeave = leave
  },
  unmounted(el) {
    if (el._magneticMove) {
      el.removeEventListener('mousemove', el._magneticMove)
    }
    if (el._magneticLeave) {
      el.removeEventListener('mouseleave', el._magneticLeave)
    }
  },
}

export const vShimmer = {
  mounted(el, binding) {
    const color = binding.value?.color || 'rgba(255, 255, 255, 0.1)'
    const duration = binding.value?.duration || 2000
    const angle = binding.value?.angle || '90deg'

    el.style.position = 'relative'
    el.style.overflow = 'hidden'

    const shimmer = document.createElement('div')
    shimmer.style.cssText = `
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        ${angle},
        transparent 0%,
        ${color} 50%,
        transparent 100%
      );
      animation: shimmer ${duration}ms infinite;
      pointer-events: none;
    `

    if (!document.getElementById('shimmer-styles')) {
      const style = document.createElement('style')
      style.id = 'shimmer-styles'
      style.textContent = `
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `
      document.head.appendChild(style)
    }

    el.appendChild(shimmer)
    el._shimmer = shimmer
  },
  unmounted(el) {
    if (el._shimmer) {
      el._shimmer.remove()
    }
  },
}

export function registerDirectives(app) {
  app.directive('reveal', vReveal)
  app.directive('stagger', vStagger)
  app.directive('parallax', vParallax)
  app.directive('ripple', vRipple)
  app.directive('magnetic', vMagnetic)
  app.directive('shimmer', vShimmer)
}
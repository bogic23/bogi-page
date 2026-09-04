import { toDate } from './dateUtils'
import { formatDistanceToNow } from 'date-fns'

export function formatDate(dateString) {
  const date = toDate(dateString)
  if (!date) return ''
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateTime(dateString) {
  const date = toDate(dateString)
  if (!date) return ''
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatEventTime(dateString) {
  const date = toDate(dateString)
  if (!date) return ''
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatDueDate(dateString) {
  const date = toDate(dateString)
  if (!date) return ''
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${formatEventTime(dateString)}`
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow at ${formatEventTime(dateString)}`
  } else {
    return formatDateTime(dateString)
  }
}

export function isOverdue(dateString) {
  const date = toDate(dateString)
  if (!date) return false
  const now = new Date()
  return date < now
}

export function getRelativeTime(dateString) {
  const date = toDate(dateString)
  if (!date) return ''
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    return formatDate(dateString)
  }
}

export function formatRelativeTime(dateString) {
  const date = toDate(dateString)
  if (!date) return ''
  return formatDistanceToNow(date, { addSuffix: true })
}
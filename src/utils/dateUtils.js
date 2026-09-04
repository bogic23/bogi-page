import { format } from 'date-fns'

export const toDate = (value) => {
  if (!value) return null
  return value.toDate ? value.toDate() : new Date(value)
}

export const formatDate = (value, formatStr = 'MMM d, yyyy') => {
  const date = toDate(value)
  if (!date) return ''
  return format(date, formatStr)
}

export const formatTime = (value, formatStr = 'h:mm a') => {
  const date = toDate(value)
  if (!date) return ''
  return format(date, formatStr)
}

export const formatDateTime = (value, formatStr = "yyyy-MM-dd'T'HH:mm") => {
  const date = toDate(value)
  if (!date) return ''
  return format(date, formatStr)
}
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

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
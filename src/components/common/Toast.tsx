import { useEffect } from 'react'

export type ToastType = 'success' | 'warning' | 'error' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  isVisible: boolean
  onHide: () => void
  duration?: number
}

const TYPE_CLASSES: Record<ToastType, string> = {
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-[var(--accent)] text-white',
}

export function Toast({
  message,
  type,
  isVisible,
  onHide,
  duration = 2500,
}: ToastProps) {
  useEffect(() => {
    if (!isVisible) return
    const timer = setTimeout(onHide, duration)
    return () => clearTimeout(timer)
  }, [isVisible, duration, onHide])

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-16 left-1/2 z-[100] -translate-x-1/2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 ${TYPE_CLASSES[type]}`}
      role="alert"
    >
      {message}
    </div>
  )
}

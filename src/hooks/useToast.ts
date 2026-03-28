import { useState } from 'react'
import type { ToastType } from '../components/common/Toast'

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type })
    setIsVisible(true)
  }

  const hideToast = () => {
    setIsVisible(false)
  }

  return { toast, isVisible, showToast, hideToast }
}

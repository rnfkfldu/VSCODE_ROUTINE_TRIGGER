import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  maxHeight?: string
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = '80vh',
}: BottomSheetProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-2xl overflow-hidden rounded-t-2xl bg-[var(--bg)]"
        style={{ maxHeight }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Drag handle */}
        <div className="px-4 pt-3 pb-1">
          <div className="mx-auto h-1 w-10 rounded-full bg-[var(--border)]" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 py-2">
            <h2 className="text-base font-semibold text-[var(--text-h)]">{title}</h2>
            <button
              onClick={onClose}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--text)] hover:text-[var(--text-h)]"
              aria-label="닫기"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto px-4 pb-6">{children}</div>
      </div>
    </>
  )
}

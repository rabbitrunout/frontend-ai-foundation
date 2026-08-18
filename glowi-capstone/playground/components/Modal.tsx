'use client'

import {
  KeyboardEvent,
  ReactNode,
  useEffect,
  useRef,
} from 'react'

interface ModalProps {
  isOpen: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    previousFocusRef.current = document.activeElement as HTMLElement

    const dialog = dialogRef.current

    const focusableElements = dialog?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    focusableElements?.[0]?.focus()

    return () => {
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }

    if (event.key !== 'Tab') return

    const focusableElements =
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

    if (!focusableElements || focusableElements.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusableElements[0]
    const last = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={handleKeyDown}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2
          id="modal-title"
          className="text-xl font-bold text-slate-900"
        >
          {title}
        </h2>

        <div className="mt-4 text-slate-600">
          {children}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-teal-700 px-4 py-2 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
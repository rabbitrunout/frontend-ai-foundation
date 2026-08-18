'use client'

import { useId, useState } from 'react'

interface DisclosureProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function Disclosure({
  title,
  children,
  defaultOpen = false,
}: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <h2>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left font-semibold text-slate-900"
        >
          <span>{title}</span>

          <span aria-hidden="true">
            {isOpen ? '−' : '+'}
          </span>
        </button>
      </h2>

      {isOpen && (
        <div
          id={contentId}
          className="border-t border-slate-200 px-4 py-4 text-slate-600"
        >
          {children}
        </div>
      )}
    </section>
  )
}
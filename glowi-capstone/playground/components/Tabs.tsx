'use client'

import { KeyboardEvent, useId, useRef, useState } from 'react'

interface TabItem {
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: TabItem[]
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const baseId = useId()

  const selectTab = (index: number) => {
    setActiveIndex(index)
    tabRefs.current[index]?.focus()
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let nextIndex = index

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % tabs.length
        break

      case 'ArrowLeft':
        nextIndex = (index - 1 + tabs.length) % tabs.length
        break

      case 'Home':
        nextIndex = 0
        break

      case 'End':
        nextIndex = tabs.length - 1
        break

      default:
        return
    }

    event.preventDefault()
    selectTab(nextIndex)
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Glowi dashboard sections"
        className="flex gap-2 border-b border-slate-200"
      >
        {tabs.map((tab, index) => {
          const selected = activeIndex === index

          return (
            <button
              key={tab.label}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              id={`${baseId}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className="border-b-2 px-4 py-3 font-medium"
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.label}
          id={`${baseId}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={activeIndex !== index}
          tabIndex={0}
          className="py-5 text-slate-700"
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
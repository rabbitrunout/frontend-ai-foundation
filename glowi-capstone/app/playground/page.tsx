'use client'

import { useState } from 'react'
import Disclosure from '@/playground/components/Disclosure'
import Tabs from '@/playground/components/Tabs'
import Modal from '@/playground/components/Modal'


export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
        FE-05 Accessibility Playground
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Accessible Components
      </h1>

      <p className="mt-3 text-slate-600">
        Components implemented from scratch using W3C ARIA Authoring
        Practices patterns.
      </p>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">Disclosure</h2>

        <Disclosure title="Competition details">
          <p>
            The competition takes place Saturday at 10:00 AM in Toronto.
            Athletes should arrive 60 minutes before their scheduled time.
          </p>
        </Disclosure>

        <div className="mt-10">
  <h2 className="mb-4 text-xl font-bold">Tabs</h2>

  <Tabs
    tabs={[
      {
        label: 'Schedule',
        content: 'Upcoming Glowi training sessions and events.',
      },
      {
        label: 'Progress',
        content: 'Athlete results, awards, and progress.',
      },
      {
        label: 'Payments',
        content: 'Training payments and competition fees.',
      },
    ]}
  />

  <div className="mt-10">
  <h2 className="mb-4 text-xl font-bold">Modal Dialog</h2>

  <button
    type="button"
    onClick={() => setIsModalOpen(true)}
    className="rounded-lg bg-teal-700 px-4 py-2 font-medium text-white"
  >
    Open competition dialog
  </button>

  <Modal
    isOpen={isModalOpen}
    title="Competition registration"
    onClose={() => setIsModalOpen(false)}
  >
    <p>
      Register Kira for the upcoming competition?
    </p>
  </Modal>
</div>
</div>
      </div>
    </section>
  )
}
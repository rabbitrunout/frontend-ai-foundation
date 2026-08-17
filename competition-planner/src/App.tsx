import { useMemo, useState } from 'react'
import './App.css'
import CompetitionList from './components/CompetitionList'
import SearchBar from './components/SearchBar'
import StatusFilter from './components/StatusFilter'
import { competitions } from './data/competitions'
import type { CompetitionStatus } from './types'

type StatusFilterValue = 'All' | CompetitionStatus

function App() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilterValue>('All')

  const filteredCompetitions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return competitions.filter((competition) => {
      const matchesSearch =
        competition.name.toLowerCase().includes(normalizedSearch) ||
        competition.location.toLowerCase().includes(normalizedSearch)

      const matchesStatus =
        status === 'All' || competition.status === status

      return matchesSearch && matchesStatus
    })
  }, [search, status])

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">Rhythmic Gymnastics</p>
        <h1>Competition Planner</h1>
        <p className="hero__description">
          Find upcoming competitions, check registration status, and keep
          athlete events organized in one place.
        </p>
      </section>

      <section className="filters" aria-label="Competition filters">
        <SearchBar value={search} onChange={setSearch} />
        <StatusFilter value={status} onChange={setStatus} />
      </section>

      {(search !== '' || status !== 'All') && (
  <button
    type="button"
    className="clear-filters"
    onClick={() => {
      setSearch('')
      setStatus('All')
    }}
  >
    Clear filters
  </button>
)}

      <p className="results-count" aria-live="polite">
        {filteredCompetitions.length}{' '}
        {filteredCompetitions.length === 1 ? 'competition' : 'competitions'} found
      </p>

      <CompetitionList competitions={filteredCompetitions} />
    </main>
  )
}

export default App
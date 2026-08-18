import type { Competition } from '../types'
import CompetitionCard from './CompetitionCard'

interface CompetitionListProps {
  competitions: Competition[]
}

function CompetitionList({ competitions }: CompetitionListProps) {
  if (competitions.length === 0) {
    return (
      <div className="empty-state" role="status">
        <h2>No competitions found</h2>
        <p>Try changing your search or status filter.</p>
      </div>
    )
  }

  return (
    <section
      className="competition-list"
      aria-label="Competition results"
    >
      {competitions.map((competition) => (
        <CompetitionCard
          key={competition.id}
          competition={competition}
        />
      ))}
    </section>
  )
}

export default CompetitionList
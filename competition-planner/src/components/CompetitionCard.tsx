import type { Competition } from '../types'

interface CompetitionCardProps {
  competition: Competition
}

function CompetitionCard({ competition }: CompetitionCardProps) {
  const formattedDate = new Date(competition.date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="competition-card">
      <div className="competition-card__header">
        <div>
          <p className="competition-card__date">{formattedDate}</p>
          <h2>{competition.name}</h2>
        </div>

        <span
          className={`status status--${competition.status.toLowerCase()}`}
        >
          {competition.status}
        </span>
      </div>

      <div className="competition-card__meta">
        <span>
          <strong>Location</strong>
          {competition.location}
        </span>

        <span>
          <strong>Athlete</strong>
          {competition.athlete}
        </span>
      </div>
    </article>
  )
}

export default CompetitionCard
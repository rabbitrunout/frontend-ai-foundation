import type { CompetitionStatus } from '../types'

type StatusFilterValue = 'All' | CompetitionStatus

interface StatusFilterProps {
  value: StatusFilterValue
  onChange: (value: StatusFilterValue) => void
}

function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="control">
      <label htmlFor="status-filter">Filter by status</label>

      <select
        id="status-filter"
        value={value}
        onChange={(event) =>
          onChange(event.target.value as StatusFilterValue)
        }
      >
        <option value="All">All</option>
        <option value="Upcoming">Upcoming</option>
        <option value="Registered">Registered</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
  )
}

export default StatusFilter
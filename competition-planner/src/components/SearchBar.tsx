interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="control">
      <label htmlFor="competition-search">Search competitions</label>

      <input
        id="competition-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name or location"
      />
    </div>
  )
}

export default SearchBar
export type CompetitionStatus = 'Upcoming' | 'Registered' | 'Completed'

export interface Competition {
  id: number
  name: string
  date: string
  location: string
  athlete: string
  status: CompetitionStatus
}
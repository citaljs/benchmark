export interface Note {
  id: string
  kind: 'Note'
  ticks: number
  duration: number
  velocity: number
  noteNumber: number
  trackId: string
}

export interface NoteUpdate extends Partial<Omit<Note, 'id'>> {
  id: string
}

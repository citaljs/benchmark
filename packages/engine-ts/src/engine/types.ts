import { Event } from '../event'

export interface NoteOn extends Event<'NoteOn'> {
  noteId: string
  type: 'NoteOn'
  ticks: number
  noteNumber: number
  velocity: number
}

export interface NoteOff extends Event<'NoteOff'> {
  noteId: string
  type: 'NoteOff'
  ticks: number
  noteNumber: number
}

import { Event } from '../event'

export interface NoteOn extends Event<'NoteOn'> {
  type: 'NoteOn'
  ticks: number
  noteNumber: number
  velocity: number
}

export interface NoteOff extends Event<'NoteOff'> {
  type: 'NoteOff'
  ticks: number
  noteNumber: number
}

import { Note } from '@architecture-benchmark/store-ts'
import { NoteOff, NoteOn } from './types'

export const disassembleNote = (note: Readonly<Note>): [NoteOn, NoteOff] => {
  const noteOnEvent: NoteOn = {
    type: 'NoteOn',
    ticks: note.ticks,
    velocity: note.velocity,
    noteNumber: note.noteNumber,
  }

  const noteOffEvent: NoteOff = {
    type: 'NoteOff',
    ticks: note.ticks + note.duration,
    noteNumber: note.noteNumber,
  }

  return [noteOnEvent, noteOffEvent]
}

export const disassembleNotes = (
  notes: Readonly<Note[]>,
): Array<NoteOn | NoteOff> => notes.flatMap((event) => disassembleNote(event))

export const filterEventsWithTicksRange = <T extends { ticks: number }>(
  events: T[],
  startTicks: number,
  endTicks: number,
): T[] =>
  events.filter((event) => event.ticks >= startTicks && event.ticks < endTicks)

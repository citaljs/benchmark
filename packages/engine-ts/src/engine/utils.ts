import { Note } from '@architecture-benchmark/event-ts'
import { NoteOff, NoteOn } from './types'

export const disassembleNote = (note: Readonly<Note>): [NoteOn, NoteOff] => {
  const noteOnEvent: NoteOn = {
    noteId: note.id,
    type: 'NoteOn',
    ticks: note.ticks,
    velocity: note.velocity,
    noteNumber: note.noteNumber,
  }

  const noteOffEvent: NoteOff = {
    noteId: note.id,
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

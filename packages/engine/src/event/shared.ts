type EventType = 'NoteOn' | 'NoteOff'

export interface Event<T extends EventType> {
  type: T
}

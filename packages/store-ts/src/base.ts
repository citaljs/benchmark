import { Event, EventUpdate } from '@benchmark/event-ts'
import { Filter } from './filter'

export interface IStore {
  getEvents(filter?: Filter): Event[]
  addEvent(event: Event): void
  addEvents(events: Event[]): void
  updateEvent(event: EventUpdate): void
  updateEvents(events: EventUpdate[]): void
  removeEvent(eventId: string): void
  removeEvents(eventIds: string[]): void
}

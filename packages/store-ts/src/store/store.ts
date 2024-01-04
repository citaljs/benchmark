import { Event, EventUpdate } from '../event'
import { Song } from '../song'

export interface IStore {
  getEvents(): Event[]
  getEventsInTicksRange(
    startTicks: number,
    endTicks: number,
    withinDuration: boolean,
  ): Event[]
  addEvent(event: Event): Event
  updateEvent(event: Event): Event
  removeEvent(eventId: string): void
}

export class Store implements IStore {
  private song: Song

  constructor() {
    this.song = new Song()
  }

  getEvents() {
    return this.song.getEvents()
  }

  getEventsInTicksRange(
    startTicks: number,
    endTicks: number,
    withinDuration: boolean,
  ) {
    return this.song.getEventsInTicksRange(startTicks, endTicks, withinDuration)
  }

  addEvent(event: Event) {
    return this.song.addEvent(event)
  }

  updateEvent(event: EventUpdate) {
    return this.song.updateEvent(event)
  }

  removeEvent(eventId: string) {
    return this.song.removeEvent(eventId)
  }
}

export function createStore(): IStore {
  return new Store()
}

import { Event, EventUpdate } from '../event'

export interface IStore {
  getEvents(): Event[]
  getEventsInTicksRange(
    startTicks: number,
    endTicks: number,
    withinDuration: boolean,
  ): Event[]
  getEventsInTrack(trackId: string): Event[]
  addEvent(event: Event): void
  addEvents(events: Event[]): void
  updateEvent(event: EventUpdate): void
  updateEvents(events: EventUpdate[]): void
  removeEvent(eventId: string): void
  removeEvents(eventIds: string[]): void
}

export class Store implements IStore {
  private events: Event[]

  constructor() {
    this.events = []
  }

  getEvents() {
    return this.events
  }

  getEventsInTicksRange(
    startTicks: number,
    endTicks: number,
    withinDuration: boolean,
  ) {
    return this.events.filter((event) => {
      const { ticks, duration } = event

      if (withinDuration) {
        return (
          (ticks >= startTicks && ticks <= endTicks) ||
          ticks + duration > startTicks
        )
      }

      return ticks >= startTicks && ticks <= endTicks
    })
  }

  getEventsInTrack(trackId: string) {
    return this.events.filter((event) => event.trackId === trackId)
  }

  addEvent(event: Event) {
    this.events.push(event)
  }

  addEvents(events: Event[]) {
    this.events.push(...events)
  }

  updateEvent(event: EventUpdate) {
    const { id } = event
    const eventIndex = this.events.findIndex((event) => event.id === id)
    if (eventIndex === -1) {
      throw new Error(`Event with id ${id} not found`)
    }

    const currentEvent = this.events[eventIndex]
    const newEvent = {
      ...currentEvent,
      ...event,
    }

    this.events[eventIndex] = newEvent
    return newEvent
  }

  updateEvents(events: EventUpdate[]) {
    events.forEach((event) => this.updateEvent(event))
  }

  removeEvent(eventId: string) {
    const eventIndex = this.events.findIndex((event) => event.id === eventId)
    if (eventIndex === -1) {
      throw new Error(`Event with id ${eventId} not found`)
    }

    this.events.splice(eventIndex, 1)
  }

  removeEvents(eventIds: string[]) {
    eventIds.forEach((eventId) => this.removeEvent(eventId))
  }
}

export function createStore(): IStore {
  return new Store()
}

import { Event, EventUpdate } from '@benchmark/event-ts'
import { Filter, TicksRangeFilter } from './filter'

function getFilterByTrackIdsFn(trackIds: string[]) {
  return function f(event: Event) {
    return trackIds.includes(event.trackId)
  }
}

function getFilterByTicksRangeFn(ticksRange: TicksRangeFilter) {
  const { start, end, withinDuration } = ticksRange

  return function f(event: Event) {
    const { ticks, duration } = event

    if (withinDuration) {
      return (ticks >= start && ticks <= end) || ticks + duration > start
    }

    return ticks >= start && ticks <= end
  }
}

export interface IStore {
  getEvents(filter?: Filter): Event[]
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

  getEvents(filter?: Filter) {
    let events = [...this.events]

    if (filter?.trackIds) {
      events = events.filter(getFilterByTrackIdsFn(filter.trackIds))
    }

    if (filter?.ticksRange) {
      events = events.filter(getFilterByTicksRangeFn(filter.ticksRange))
    }

    return events
  }

  addEvent(event: Event) {
    this.events.push(event)
  }

  addEvents(events: Event[]) {
    events.forEach((event) => this.addEvent(event))
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

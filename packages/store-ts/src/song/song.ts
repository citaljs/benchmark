import { Event, EventUpdate } from '../event'

export class Song {
  private events: Map<string, Event>

  constructor() {
    this.events = new Map()
  }

  getEvents(): Event[] {
    const events: Event[] = []
    this.events.forEach((event) => {
      events.push(event)
    })
    return events
  }

  getEventsInTicksRange(
    startTicks: number,
    endTicks: number,
    withinDuration: boolean,
  ) {
    const events: Event[] = []

    this.events.forEach((event) => {
      const { ticks, duration } = event

      if (withinDuration) {
        if (
          (ticks >= startTicks && ticks <= endTicks) ||
          ticks + duration > startTicks
        ) {
          events.push(event)
        }
      }

      if (ticks >= startTicks && ticks <= endTicks) {
        events.push(event)
      }
    })

    return events
  }

  addEvent(event: Event): Event {
    this.events.set(event.id, event)
    return event
  }

  updateEvent(event: EventUpdate): Event {
    const { id } = event
    const currentEvent = this.events.get(id)
    if (!currentEvent) {
      throw new Error(`Event with id ${id} not found`)
    }

    const newEvent = {
      ...currentEvent,
      ...event,
    }

    this.events.set(id, newEvent)
    return newEvent
  }

  removeEvent(eventId: string): void {
    const exists = this.events.delete(eventId)
    if (!exists) {
      throw new Error(`Event with id ${eventId} not found`)
    }
  }
}

/* export class Song {
  private ppq: number
  private tracks: ITrack[]
  private events: Map<string, Event>
  private ticksIndex: BTree<number, Set<string>>
  private endTicksIndex: BTree<number, Set<string>>

  constructor(ppq: number) {
    this.ppq = ppq
    this.tracks = []
    this.events = new Map()
    this.ticksIndex = new BTree()
    this.endTicksIndex = new BTree()
  }

  getTrack(trackId: string) {
    return this.tracks.find((track) => track.getId() === trackId)
  }

  getTracks() {
    return this.tracks
  }

  addTrack(track: ITrack): ITrack {
    this.tracks.push(track)
    return track
  }

  removeTrack(trackId: string) {
    this.tracks = this.tracks.filter((track) => track.getId() !== trackId)
  }
} */

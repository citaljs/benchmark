import { Event, EventUpdate } from '../event'
import { IStore, createStore } from '../store'
import { ITrack, createTrack } from '../track'

export interface ISong {
  getEvents(): Event[]
  getEventsInTicksRange(
    startTicks: number,
    endTicks: number,
    withinDuration: boolean,
  ): Event[]
  addEvent(event: Event): void
  addEvents(events: Event[]): void
  updateEvent(event: EventUpdate): void
  updateEvents(events: EventUpdate[]): void
  removeEvent(eventId: string): void
  removeEvents(eventIds: string[]): void
  getTrack(trackId: string): ITrack
  getTracks(): ITrack[]
  createTrack(trackId: string): void
  removeTrack(trackId: string): void
}

export class Song implements ISong {
  private store: IStore
  private tracks: ITrack[]

  constructor() {
    this.store = createStore()
    this.tracks = []
  }

  getEvents() {
    return this.store.getEvents()
  }

  getEventsInTicksRange(
    startTicks: number,
    endTicks: number,
    withinDuration: boolean,
  ) {
    return this.store.getEventsInTicksRange(
      startTicks,
      endTicks,
      withinDuration,
    )
  }

  addEvent(event: Event) {
    if (!this.findTrack(event.trackId)) {
      throw new Error(`Track with id ${event.trackId} not found`)
    }
    this.store.addEvent(event)
  }

  addEvents(events: Event[]) {
    events.forEach((event) => {
      if (!this.findTrack(event.trackId)) {
        throw new Error(`Track with id ${event.trackId} not found`)
      }
    })
    this.store.addEvents(events)
  }

  updateEvent(event: EventUpdate) {
    this.store.updateEvent(event)
  }

  updateEvents(events: EventUpdate[]) {
    this.store.updateEvents(events)
  }

  removeEvent(eventId: string) {
    this.store.removeEvent(eventId)
  }

  removeEvents(eventIds: string[]) {
    this.store.removeEvents(eventIds)
  }

  private findTrack(trackId: string) {
    return this.tracks.find((track) => track.getId() === trackId)
  }

  getTrack(trackId: string) {
    const track = this.findTrack(trackId)
    if (!track) {
      throw new Error(`Track with id ${trackId} not found`)
    }
    return track
  }

  getTracks() {
    return this.tracks
  }

  createTrack(trackId: string) {
    this.tracks.push(createTrack(trackId, this.store))
  }

  removeTrack(trackId: string) {
    const trackIndex = this.tracks.findIndex(
      (event) => event.getId() === trackId,
    )
    if (trackIndex === -1) {
      throw new Error(`Event with id ${trackId} not found`)
    }

    this.tracks.splice(trackIndex, 1)
  }
}

export function createSong(): ISong {
  return new Song()
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

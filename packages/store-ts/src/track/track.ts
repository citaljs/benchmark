import { Event } from '../event'
import { IStore } from '../store'

export interface ITrack {
  getId(): string
  getEvents(): Event[]
}

export class Track implements ITrack {
  private id: string
  private store: IStore

  constructor(id: string, store: IStore) {
    this.id = id
    this.store = store
  }

  getId() {
    return this.id
  }

  getEvents() {
    return this.store.getEventsInTrack(this.id)
  }
}

export function createTrack(id: string, store: IStore): ITrack {
  return new Track(id, store)
}

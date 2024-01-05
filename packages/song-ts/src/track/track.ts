import { Event } from '@architecture-benchmark/event-ts'
import { Filter, IStore } from '@architecture-benchmark/store-ts'

export interface ITrack {
  getId(): string
  getEvents(filter?: Omit<Filter, 'trackIds'>): Event[]
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
    return this.store.getEvents({
      trackIds: [this.id],
    })
  }
}

export function createTrack(id: string, store: IStore): ITrack {
  return new Track(id, store)
}

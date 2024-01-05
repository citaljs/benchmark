import { Event } from '@architecture-benchmark/event-ts'
import { Filter, IStore } from '@architecture-benchmark/store-ts'
import { ISynthesizer } from '@architecture-benchmark/synthesizer-base'

export interface ITrack {
  getId(): string
  getEvents(filter?: Omit<Filter, 'trackIds'>): Event[]
  getSynthesizer(): ISynthesizer | undefined
  setSynthesizer(synthesizer: ISynthesizer): void
}

export class Track implements ITrack {
  private id: string
  private store: IStore
  private synthesizer?: ISynthesizer

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

  getSynthesizer() {
    return this.synthesizer
  }

  setSynthesizer(synthesizer: ISynthesizer) {
    this.synthesizer = synthesizer
  }
}

export function createTrack(id: string, store: IStore): ITrack {
  return new Track(id, store)
}

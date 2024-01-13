import { Event, EventUpdate } from '@benchmark/event-ts'
import BTree from 'sorted-btree'
import { IStore } from './base'
import { Filter } from './filter'

export class StoreV2 implements IStore {
  private events: Map<string, Event>
  private trackIdTicksIndex: BTree<string, BTree<number, Set<string>>>
  private trackIdEndTicksIndex: BTree<string, BTree<number, Set<string>>>

  constructor() {
    this.events = new Map()
    this.trackIdTicksIndex = new BTree()
    this.trackIdEndTicksIndex = new BTree()
  }

  private getEventsFromTicksIndex(
    ticksIndex: BTree<number, Set<string>>,
    filter?: Filter,
  ) {
    return ticksIndex
      .filter((ticks) => {
        if (filter?.ticksRange) {
          const { start, end, withinDuration } = filter.ticksRange
          if (withinDuration) {
            return (ticks >= start && ticks <= end) || ticks + 1 > start
          }
          return ticks >= start && ticks <= end
        }
        return true
      })
      .reduce((acc, [, eventIds]) => {
        const result = [...acc]

        eventIds.forEach((eventId) => {
          const event = this.events.get(eventId)
          if (!event) {
            throw new Error(`Event with id ${eventId} not found`)
          }
          result.push(event)
        })

        return result
      }, [] as Event[])
  }

  getEvents(filter?: Filter) {
    if (!filter?.ticksRange && !filter?.trackIds) {
      return Array.from(this.events.values())
    }

    const events = this.trackIdTicksIndex
      .filter((trackId) => {
        if (filter?.trackIds) {
          return filter.trackIds.includes(trackId)
        }
        return true
      })
      .reduce((acc, [, ticksIndex]) => {
        const result = this.getEventsFromTicksIndex(ticksIndex, filter)
        return [...acc, ...result]
      }, [] as Event[])

    const eventIds = new Set(events.map((event) => event.id))

    if (!filter?.ticksRange?.withinDuration) {
      return events
    }

    const hasDurationEvents = this.trackIdEndTicksIndex
      .filter((trackId) => {
        if (filter?.trackIds) {
          return filter.trackIds.includes(trackId)
        }
        return true
      })
      .reduce((acc, [, endTicksIndex]) => {
        const result = this.getEventsFromTicksIndex(
          endTicksIndex,
          filter,
        ).filter((event) => !eventIds.has(event.id))
        return [...acc, ...result]
      }, [] as Event[])

    return [...events, ...hasDurationEvents]
  }

  addEvent(event: Event) {
    this.events.set(event.id, event)

    const { ticks, duration, trackId } = event
    const endTicks = ticks + duration

    if (this.trackIdTicksIndex.has(trackId)) {
      const ticksIndex = this.trackIdTicksIndex.get(trackId)
      if (ticksIndex?.has(ticks)) {
        ticksIndex.get(ticks)?.add(event.id)
      } else {
        ticksIndex?.set(ticks, new Set([event.id]))
      }
    } else {
      const ticksIndex = new BTree<number, Set<string>>()
      ticksIndex.set(ticks, new Set([event.id]))
      this.trackIdTicksIndex.set(trackId, ticksIndex)
    }

    if (this.trackIdEndTicksIndex.has(trackId)) {
      const endTicksIndex = this.trackIdEndTicksIndex.get(trackId)
      if (endTicksIndex?.has(endTicks)) {
        endTicksIndex.get(endTicks)?.add(event.id)
      } else {
        endTicksIndex?.set(endTicks, new Set([event.id]))
      }
    } else {
      const endTicksIndex = new BTree<number, Set<string>>()
      endTicksIndex.set(endTicks, new Set([event.id]))
      this.trackIdEndTicksIndex.set(trackId, endTicksIndex)
    }
  }

  addEvents(events: Event[]) {
    events.forEach((event) => this.addEvent(event))
  }

  updateEvent(event: EventUpdate) {
    const { id } = event

    const currentEvent = this.events.get(id)
    if (!currentEvent) {
      throw new Error(`Event with id ${id} not found`)
    }

    this.removeEvent(id)

    const newEvent = {
      ...currentEvent,
      ...event,
    }

    this.addEvent(newEvent)
  }

  updateEvents(events: EventUpdate[]) {
    events.forEach((event) => this.updateEvent(event))
  }

  removeEvent(eventId: string) {
    const events = this.events.get(eventId)
    if (!events) {
      throw new Error(`Event with id ${eventId} not found`)
    }

    const { ticks, duration, trackId } = events
    const endTicks = ticks + duration

    const ticksIndex = this.trackIdTicksIndex.get(trackId)
    if (ticksIndex?.has(ticks)) {
      ticksIndex.get(ticks)?.delete(eventId)
    }

    const endTicksIndex = this.trackIdEndTicksIndex.get(trackId)
    if (endTicksIndex?.has(endTicks)) {
      endTicksIndex.get(endTicks)?.delete(eventId)
    }

    this.events.delete(eventId)
  }

  removeEvents(eventIds: string[]) {
    eventIds.forEach((eventId) => this.removeEvent(eventId))
  }
}

export function createStoreV2(): IStore {
  return new StoreV2()
}

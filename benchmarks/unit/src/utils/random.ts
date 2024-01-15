import { Event } from '@benchmark/event-ts'

export function randomId(): string {
  return crypto.randomUUID()
}

export function randomTicks(max?: number): number {
  return Math.floor(Math.random() * (max ?? Number.MAX_SAFE_INTEGER))
}

function random7bit(): number {
  return Math.floor(Math.random() * 127)
}

export function randomNoteNumber(): number {
  return random7bit()
}

export function randomVelocity(): number {
  return random7bit()
}

export function randomEvent(availableTrackIds: string[]): Event {
  return {
    id: randomId(),
    kind: 'Note',
    ticks: randomTicks(),
    duration: randomTicks(),
    noteNumber: randomNoteNumber(),
    velocity: randomVelocity(),
    trackId:
      availableTrackIds[Math.floor(Math.random() * availableTrackIds.length)],
  }
}

export function randomEvents(
  count: number,
  availableTrackIds: string[],
): Event[] {
  const events: Event[] = []
  for (let i = 0; i < count; i += 1) {
    const event = randomEvent(availableTrackIds)
    events.push(event)
  }
  return events
}

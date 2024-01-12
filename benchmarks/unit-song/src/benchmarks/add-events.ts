import { Event } from '@benchmark/event-ts'
import { ISong, createSong } from '@benchmark/song-ts'
import { runBenchmark } from '../utils/benchmark'
import { randomEvents, randomId } from '../utils/random'

export function runAddEventsBenchmark() {
  let song: ISong = createSong()
  const trackId = randomId()
  song.createTrack(trackId)
  let events: Event[] = randomEvents(100, trackId)

  runBenchmark(
    'song.addEvents',
    () => {
      song.addEvents(events)
    },
    {
      onIterationEnd: () => {
        song = createSong()
        const trackId = randomId()
        song.createTrack(trackId)
        events = randomEvents(10, trackId)
      },
    },
  )
}

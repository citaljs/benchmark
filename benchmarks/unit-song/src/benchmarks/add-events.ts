import { createSong } from '@benchmark/song-ts'
import { createStore } from '@benchmark/store-ts'
import { runBenchmark } from '../utils/benchmark'
import { randomEvents, randomId } from '../utils/random'

export function runAddEventsBenchmark() {
  const store = createStore()
  let song = createSong(store)
  const trackId = randomId()
  song.createTrack(trackId)
  let events = randomEvents(100, trackId)

  runBenchmark(
    'song.addEvents',
    () => {
      song.addEvents(events)
    },
    {
      onIterationEnd: () => {
        song = createSong(store)
        const trackId = randomId()
        song.createTrack(trackId)
        events = randomEvents(10, trackId)
      },
    },
  )
}

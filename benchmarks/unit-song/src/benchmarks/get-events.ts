import { createSong } from '@benchmark/song-ts'
import { createStore } from '@benchmark/store-ts'
import { runBenchmark } from '../utils/benchmark'
import { randomEvents, randomId } from '../utils/random'

export function runGetEventsBenchmark() {
  const store = createStore()
  const song = createSong(store)
  const trackId = randomId()
  song.createTrack(trackId)
  const events = randomEvents(100, trackId)
  song.addEvents(events)

  runBenchmark('song.getEvents', () => {
    song.getEvents()
  })
}

import { Event } from '@benchmark/event-ts'
import { ISong, createSong } from '@benchmark/song-ts'
import { runBenchmark } from '../utils/benchmark'
import { randomEvents, randomId } from '../utils/random'

export function runGetEventsBenchmark() {
  const song: ISong = createSong()
  const trackId = randomId()
  song.createTrack(trackId)
  const events: Event[] = randomEvents(100, trackId)
  song.addEvents(events)

  runBenchmark('song.getEvents', () => {
    song.getEvents()
  })
}

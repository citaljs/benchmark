import { Event } from '@benchmark/event-ts'
import { ISong, createSong } from '@benchmark/song-ts'
import { computeMetrics, printMetrics, runBenchmark } from '../utils/benchmark'
import { randomEvents, randomId } from '../utils/random'

export function runAddEventsBenchmark() {
  let song: ISong = createSong()
  const trackId = randomId()
  song.createTrack(trackId)
  let events: Event[] = randomEvents(100, trackId)

  const result = runBenchmark(
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

  const metrics = computeMetrics(result)

  printMetrics(metrics, 'song.addEvents')
}

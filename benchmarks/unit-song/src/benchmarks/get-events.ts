import { createSong } from '@benchmark/song-ts'
import { IStore, createStore, createStoreV2 } from '@benchmark/store-ts'
import { range } from '../utils/array'
import { runBenchmark } from '../utils/benchmark'
import { randomEvents, randomId } from '../utils/random'

function benchmark(label: string, store: IStore, numEvents: number) {
  const song = createSong(store)

  range(10).forEach(() => {
    song.createTrack(randomId())
  })

  const trackIds = song.getTracks().map((track) => track.getId())

  const events = randomEvents(numEvents, trackIds)
  song.addEvents(events)

  runBenchmark(label, () => {
    song.getEvents()
  })
}

export function runGetEventsBenchmarks() {
  console.log('==== [getEvents] ====')

  const labelStorePairs = [
    { label: 'song-ts-v1', store: createStore() },
    { label: 'song-ts-v2', store: createStoreV2() },
  ]

  const numEventsList = [100, 1000, 10000, 100000]

  numEventsList.forEach((numEvents) =>
    labelStorePairs.forEach(({ label, store }) =>
      benchmark(`${label}-${numEvents}events`, store, numEvents),
    ),
  )

  console.log()
}

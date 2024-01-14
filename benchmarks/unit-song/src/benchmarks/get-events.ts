import { createSong } from '@benchmark/song-ts'
import { IStore, createStore, createStoreV2 } from '@benchmark/store-ts'
import { randomChoice, range } from '../utils/array'
import { runBenchmark } from '../utils/benchmark'
import { randomEvents, randomId } from '../utils/random'

function basicBenchmark(label: string, store: IStore, numEvents: number) {
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

function filterByTrackIdsBenchmark(
  label: string,
  store: IStore,
  numEvents: number,
) {
  const song = createSong(store)

  range(10).forEach(() => {
    song.createTrack(randomId())
  })

  const trackIds = song.getTracks().map((track) => track.getId())

  const events = randomEvents(numEvents, trackIds)
  song.addEvents(events)

  runBenchmark(label, () => {
    song.getEvents({
      trackIds: [randomChoice(trackIds)],
    })
  })
}

function filterByTicksRangeBenchmark(
  label: string,
  store: IStore,
  numEvents: number,
) {
  const song = createSong(store)

  range(10).forEach(() => {
    song.createTrack(randomId())
  })

  const trackIds = song.getTracks().map((track) => track.getId())

  const events = randomEvents(numEvents, trackIds)
  song.addEvents(events)

  runBenchmark(label, () => {
    song.getEvents({
      ticksRange: {
        start: 0,
        end: 10000,
        withinDuration: true,
      },
    })
  })
}

function filterByTrackIdsAndTicksRangeBenchmark(
  label: string,
  store: IStore,
  numEvents: number,
) {
  const song = createSong(store)

  range(10).forEach(() => {
    song.createTrack(randomId())
  })

  const trackIds = song.getTracks().map((track) => track.getId())

  const events = randomEvents(numEvents, trackIds)
  song.addEvents(events)

  runBenchmark(label, () => {
    song.getEvents({
      trackIds: [randomChoice(trackIds)],
      ticksRange: {
        start: 0,
        end: 10000,
        withinDuration: true,
      },
    })
  })
}

export function runGetEventsBenchmarks() {
  console.log('==== [getEvents] ====')

  const labelStorePairs = [
    { label: 'song-ts-v1', store: createStore() },
    { label: 'song-ts-v2', store: createStoreV2() },
  ]

  // const numEventsList = [100, 1000, 10000, 100000]
  const numEventsList = [100, 1000, 10000]

  const benchmarks = [
    (label: string, store: IStore, numEvents: number) =>
      basicBenchmark(`${label}-${numEvents}events`, store, numEvents),
    (label: string, store: IStore, numEvents: number) =>
      filterByTrackIdsBenchmark(
        `${label}-${numEvents}events-filter-by-track-ids`,
        store,
        numEvents,
      ),
    (label: string, store: IStore, numEvents: number) =>
      filterByTicksRangeBenchmark(
        `${label}-${numEvents}events-filter-by-ticks-range`,
        store,
        numEvents,
      ),
    (label: string, store: IStore, numEvents: number) =>
      filterByTrackIdsAndTicksRangeBenchmark(
        `${label}-${numEvents}events-filter-by-track-ids-and-ticks-range`,
        store,
        numEvents,
      ),
  ]

  benchmarks.forEach((benchmark) =>
    numEventsList.forEach((numEvents) =>
      labelStorePairs.forEach(({ label, store }) => {
        benchmark(label, store, numEvents)
      }),
    ),
  )

  console.log()
}

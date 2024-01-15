import { createSong } from '@benchmark/song-ts'
import { IStore, createStore, createStoreV2 } from '@benchmark/store-ts'
import { range } from '../utils/array'
import { runBenchmark } from '../utils/benchmark'
import { randomEvent, randomEvents, randomId } from '../utils/random'

function benchmark(label: string, store: IStore, numEvents: number) {
  function setup() {
    const song = createSong(store)

    range(10).forEach(() => {
      song.createTrack(randomId())
    })

    const trackIds = song.getTracks().map((track) => track.getId())

    const events = randomEvents(numEvents, trackIds)
    song.addEvents(events)

    const newEvent = {
      ...randomEvent(trackIds),
      id: events[0].id,
    }

    return { song, newEvent }
  }

  const { song: _song, newEvent: _newEvent } = setup()
  let song = _song
  let newEvent = _newEvent

  runBenchmark(
    label,
    () => {
      song.updateEvent(newEvent)
    },
    {
      onIterationEnd: () => {
        const { song: _song, newEvent: _newEvent } = setup()
        song = _song
        newEvent = _newEvent
      },
    },
  )
}

export function runUpdateEventBenchmarks() {
  console.log('==== [updateEvent] ====')

  const labelStorePairs = [
    { label: 'song-ts-v1', store: createStore() },
    { label: 'song-ts-v2', store: createStoreV2() },
  ]

  const numEventsList = [100, 1000, 5000]

  numEventsList.forEach((numEvents) =>
    labelStorePairs.forEach(({ label, store }) =>
      benchmark(`${label}-${numEvents}events`, store, numEvents),
    ),
  )

  console.log()
}

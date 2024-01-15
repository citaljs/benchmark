import { createSong } from '@benchmark/song-ts'
import { IStore, createStore, createStoreV2 } from '@benchmark/store-ts'
import { range } from '../utils/array'
import { runBenchmark } from '../utils/benchmark'
import { randomEvents, randomId } from '../utils/random'

function benchmark(label: string, store: IStore, numEvents: number) {
  function setup() {
    const song = createSong(store)

    range(10).forEach(() => {
      song.createTrack(randomId())
    })

    const trackIds = song.getTracks().map((track) => track.getId())

    const events = randomEvents(numEvents, trackIds)
    song.addEvents(events)

    const deleteEventId = events[Math.floor(Math.random() * events.length)].id
    return { song, deleteEventId }
  }

  const { song: _song, deleteEventId: _deleteEventId } = setup()
  let song = _song
  let deleteEventId = _deleteEventId

  runBenchmark(
    label,
    () => {
      song.removeEvent(deleteEventId)
    },
    {
      onIterationEnd: () => {
        const { song: _song, deleteEventId: _deleteEventId } = setup()
        song = _song
        deleteEventId = _deleteEventId
      },
    },
  )
}

export function runRemoveEventBenchmarks() {
  console.log('==== [removeEvent] ====')

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

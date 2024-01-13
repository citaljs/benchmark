import { createSong } from '@benchmark/song-ts'
import { IStore, createStore, createStoreV2 } from '@benchmark/store-ts'
import { range } from '../utils/array'
import { runBenchmark } from '../utils/benchmark'
import { randomEvent, randomId } from '../utils/random'

function benchmark(label: string, store: IStore) {
  function setup() {
    const song = createSong(store)
    range(10).forEach(() => {
      song.createTrack(randomId())
    })
    const trackIds = song.getTracks().map((track) => track.getId())
    const event = randomEvent(trackIds)

    return { song, event }
  }

  const { song: _song, event: _event } = setup()
  let song = _song
  let event = _event

  runBenchmark(
    label,
    () => {
      song.addEvent(event)
    },
    {
      onIterationEnd: () => {
        const { song: _song, event: _event } = setup()
        song = _song
        event = _event
      },
    },
  )
}

export function runAddEventBenchmarks() {
  console.log('==== [addEvent] ====')

  const labelStorePairs = [
    { label: 'song-ts-v1', store: createStore() },
    { label: 'song-ts-v2', store: createStoreV2() },
  ]

  labelStorePairs.forEach(({ label, store }) => benchmark(label, store))

  console.log()
}

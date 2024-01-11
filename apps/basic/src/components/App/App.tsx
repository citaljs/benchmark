import { createEngine } from '@benchmark/engine-ts'
import { OscSynthesizer } from '@benchmark/synthesizer-osc'
import FPSStats from 'react-fps-stats'
import { EventsSection } from './components/EventsSection'
import { ProgressSection } from './components/ProgressSection'
import { TransportSection } from './components/TransportSection'

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

const engine = createEngine()
const song = engine.getSong()

function addEvents() {
  for (let i = 0; i < 10; i += 1) {
    song.createTrack(`${i + 1}`)
  }

  const tracks = song.getTracks()
  const oscTypes = ['sine', 'square', 'sawtooth', 'triangle'] as const
  tracks.forEach((track, index) => {
    const synthesizer = new OscSynthesizer(
      new AudioContext(),
      8,
      oscTypes[index % 4],
    )
    track.setSynthesizer(synthesizer)
  })

  // for (let i = 0; i < 5_000_000; i += 1) {
  for (let i = 0; i < 0; i += 1) {
    song.addEvent({
      id: `${i + 1}`,
      kind: 'Note',
      ticks: getRandomInt(100_000),
      duration: getRandomInt(2_000) + 200,
      velocity: 1,
      noteNumber: getRandomInt(36) + 36,
      trackId: `${(i % 10) + 1}`,
    })
  }
}

addEvents()

export function App() {
  return (
    <>
      <FPSStats />
      <div className="w-full m-auto mt-12 p-4 max-w-[40rem] flex flex-col space-y-8">
        <TransportSection engine={engine} />
        <ProgressSection engine={engine} />
        <EventsSection song={song} />
      </div>
    </>
  )
}

import { createEngine } from '@architecture-benchmark/engine'
import { useState } from 'react'
import {
  createSoundFont2SynthNode,
  SoundFont2SynthNode,
} from 'sf2-synth-audio-worklet'

const sf2URL = new URL('./assets/GeneralUser GS v1.471.sf2', import.meta.url)
const engine = createEngine()
const store = engine.getStore()

store.addEvent({
  id: '1',
  kind: 'Note',
  ticks: 0,
  duration: 480,
  velocity: 100,
  noteNumber: 60,
  trackId: '1',
})

store.addEvent({
  id: '2',
  kind: 'Note',
  ticks: 120,
  duration: 480,
  velocity: 100,
  noteNumber: 64,
  trackId: '1',
})

store.addEvent({
  id: '3',
  kind: 'Note',
  ticks: 240,
  duration: 480,
  velocity: 100,
  noteNumber: 67,
  trackId: '1',
})

store.addEvent({
  id: '4',
  kind: 'Note',
  ticks: 480,
  duration: 480,
  velocity: 100,
  noteNumber: 60,
  trackId: '1',
})

function App() {
  const [started, setStarted] = useState(false)
  const [node, setNode] = useState<SoundFont2SynthNode>()

  console.log('engine:', engine)
  console.log('store:', store)

  function setup() {
    setStarted(true)
    const audioContext = new AudioContext()
    createSoundFont2SynthNode(audioContext, sf2URL).then((node) => {
      node.connect(audioContext.destination)
      engine.setSynthesizerNode(node)
      setNode(node)
    })
  }

  function noteOn() {
    node?.noteOn(0, 60, 100, 0)
  }

  function noteOff() {
    node?.noteOff(0, 60, 0)
  }

  function play() {
    engine.play()
  }

  function stop() {
    engine.stop()
  }

  return (
    <div>
      <button type="button" disabled={started} onClick={setup}>
        Start
      </button>
      <button
        type="button"
        disabled={node === undefined}
        onMouseDown={noteOn}
        onMouseUp={noteOff}
      >
        Sound
      </button>
      <button type="button" disabled={node === undefined} onClick={play}>
        Play
      </button>
      <button type="button" disabled={node === undefined} onClick={stop}>
        Stop
      </button>
    </div>
  )
}

export default App

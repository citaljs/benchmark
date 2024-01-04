import { createEngine } from '@architecture-benchmark/engine'
import { useEffect, useRef, useState } from 'react'
import FPSStats from 'react-fps-stats'
import {
  SoundFont2SynthNode,
  createSoundFont2SynthNode,
} from 'sf2-synth-audio-worklet'

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

const sf2URL = new URL('./assets/GeneralUser GS v1.471.sf2', import.meta.url)
const engine = createEngine()
const store = engine.getStore()

function addEvents() {
  for (let i = 0; i < 10000000; i += 1) {
    store.addEvent({
      id: `${i + 1}`,
      kind: 'Note',
      ticks: getRandomInt(100000),
      duration: getRandomInt(2000),
      velocity: getRandomInt(100),
      noteNumber: getRandomInt(100),
      trackId: '1',
    })
  }
}

addEvents()

function App() {
  const [started, setStarted] = useState(false)
  const [node, setNode] = useState<SoundFont2SynthNode>()
  const currentTicksRef = useRef<HTMLDivElement>(null)
  const currentSecondsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function update() {
      if (currentTicksRef.current && currentSecondsRef.current) {
        currentTicksRef.current.innerText = `${engine.getCurrentTicks()} ticks`
        currentSecondsRef.current.innerText = `${engine
          .getCurrentSeconds()
          .toFixed(2)} seconds`
      }
      requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  }, [])

  function setup() {
    setStarted(true)
    const audioContext = new AudioContext()
    createSoundFont2SynthNode(audioContext, sf2URL).then((node) => {
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
    <div style={{ width: '100%' }}>
      <FPSStats left="auto" right={0} />
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
      <div ref={currentTicksRef} />
      <div ref={currentSecondsRef} />
    </div>
  )
}

export default App

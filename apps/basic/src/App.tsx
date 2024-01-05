import { createEngine } from '@architecture-benchmark/engine-ts'
import { Event } from '@architecture-benchmark/event-ts'
import { useVirtualizer } from '@tanstack/react-virtual'
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
const song = engine.getSong()

function addEvents() {
  for (let i = 0; i < 10; i += 1) {
    song.createTrack(`${i + 1}`)
  }

  for (let i = 0; i < 10_000_000; i += 1) {
    song.addEvent({
      id: `${i + 1}`,
      kind: 'Note',
      ticks: getRandomInt(100_000),
      duration: getRandomInt(2_000),
      velocity: getRandomInt(100),
      noteNumber: getRandomInt(100),
      trackId: `${(i % 10) + 1}`,
    })
  }
}

addEvents()

function EventsInfo({ events }: { events: Event[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: events.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 20,
  })

  return (
    <div>
      ({events.length} rows)
      <div
        ref={parentRef}
        style={{
          height: `400px`,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div>{events[virtualItem.index].id}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

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
      // node.connect(audioContext.destination)
      setNode(node)
    })
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
      <button disabled={started} onClick={setup}>
        Start
      </button>
      <button disabled={node === undefined} onClick={play}>
        Play
      </button>
      <button disabled={node === undefined} onClick={stop}>
        Stop
      </button>
      <div ref={currentTicksRef} />
      <div ref={currentSecondsRef} />

      <EventsInfo events={song.getEvents()} />
      {song.getTracks().map((track) => (
        <EventsInfo key={track.getId()} events={track.getEvents()} />
      ))}
    </div>
  )
}

export default App

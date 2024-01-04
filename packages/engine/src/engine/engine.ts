import { IStore, createStore } from '@architecture-benchmark/store-ts'
import {
  DEFAULT_LOOK_AHEAD_TIME,
  millisecondsToTicks,
  ticksToSeconds,
} from '../shared'
import { Player, PlayerImpl } from './player'
import { disassembleNote } from './utils'

export interface EngineConfig {
  lookAheadTime?: number
}

export interface Engine {
  play: () => void
  stop: () => void
  getCurrentTicks: () => number
  getCurrentSeconds: () => number
  getBpm: () => number
  setBpm: (bpm: number) => void
  getPpq: () => number
  setPpq: (ppq: number) => void
  getStore: () => IStore
  setSynthesizerPort: (port: MessagePort) => void
}

class EngineImpl implements Engine {
  private readonly lookAheadTime: number
  private scheduledTicks: number
  private readonly player: Player
  private readonly store: IStore
  private synthesizerPort?: MessagePort

  constructor(store: IStore, config?: EngineConfig) {
    this.lookAheadTime = config?.lookAheadTime ?? DEFAULT_LOOK_AHEAD_TIME
    this.scheduledTicks = 0
    this.player = new PlayerImpl()
    this.store = store
    this.synthesizerPort = undefined

    this.player.onUpdate = ({ ticks }) => {
      const startTicks = this.scheduledTicks

      const endTicks =
        ticks +
        millisecondsToTicks(
          this.lookAheadTime,
          this.player.bpm,
          this.player.ppq,
        )

      this.store
        .getEventsInTicksRange(startTicks, endTicks, false)
        .forEach((event) => {
          const [noteOnEvent, noteOffEvent] = disassembleNote(event)

          if (this.synthesizerPort !== undefined) {
            const noteOnDelayTicks = noteOnEvent.ticks - startTicks
            const noteOnDelayTime = Math.max(
              0,
              ticksToSeconds(
                noteOnDelayTicks,
                this.player.bpm,
                this.player.ppq,
              ),
            )

            this.synthesizerPort.postMessage({
              kind: 'noteOn',
              noteNumber: noteOnEvent.noteNumber,
              velocity: noteOnEvent.velocity,
              delayTime: noteOnDelayTime,
            })

            const noteOffDelayTicks = noteOffEvent.ticks - startTicks
            const noteOffDelayTime = Math.max(
              0,
              ticksToSeconds(
                noteOffDelayTicks,
                this.player.bpm,
                this.player.ppq,
              ),
            )

            this.synthesizerPort.postMessage({
              kind: 'noteOff',
              noteNumber: noteOffEvent.noteNumber,
              delayTime: noteOffDelayTime,
            })
          }
        })

      this.scheduledTicks = endTicks
    }
  }

  get playing(): boolean {
    return this.player.playing
  }

  play(): void {
    this.player.play()
  }

  stop(): void {
    this.scheduledTicks = 0
    this.player.stop()
  }

  getCurrentTicks() {
    return this.player.ticks
  }

  getCurrentSeconds() {
    return this.player.seconds
  }

  getBpm() {
    return this.player.bpm
  }

  setBpm(bpm: number) {
    this.player.bpm = bpm
  }

  getPpq() {
    return this.player.ppq
  }

  setPpq(ppq: number) {
    this.player.ppq = ppq
  }

  getStore() {
    return this.store
  }

  setSynthesizerPort(port: MessagePort): void {
    this.synthesizerPort = port
  }
}

export async function createEngine(config?: EngineConfig): Promise<Engine> {
  const store = await createStore()
  return new EngineImpl(store, config)
}

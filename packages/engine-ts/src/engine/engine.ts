import { ISong, createSong } from '@benchmark/song-ts'
import {
  DEFAULT_LOOK_AHEAD_TIME,
  millisecondsToTicks,
  ticksToSeconds,
} from '../shared'
import { IPlayer, Player } from './player'
import { disassembleNote } from './utils'

export interface EngineConfig {
  lookAheadTime?: number
}

export interface IEngine {
  play: () => void
  stop: () => void
  getCurrentTicks: () => number
  getCurrentSeconds: () => number
  getBpm: () => number
  setBpm: (bpm: number) => void
  getPpq: () => number
  setPpq: (ppq: number) => void
  getSong: () => ISong
}

class Engine implements IEngine {
  private readonly lookAheadTime: number
  private scheduledTicks: number
  private readonly player: IPlayer
  private readonly song: ISong

  constructor(song: ISong, config?: EngineConfig) {
    this.lookAheadTime = config?.lookAheadTime ?? DEFAULT_LOOK_AHEAD_TIME
    this.scheduledTicks = 0
    this.player = new Player()
    this.song = song

    this.player.onInterval = ({ ticks }) => {
      const startTicks = this.scheduledTicks

      const endTicks =
        ticks +
        millisecondsToTicks(
          this.lookAheadTime,
          this.player.bpm,
          this.player.ppq,
        )

      this.song
        .getEvents({
          ticksRange: {
            start: startTicks,
            end: endTicks,
            withinDuration: false,
          },
        })
        .forEach((event) => {
          const { trackId } = event
          const track = this.song.getTrack(trackId)
          const synthesizer = track?.getSynthesizer()

          if (synthesizer) {
            const [noteOnEvent, noteOffEvent] = disassembleNote(event)

            const noteOnDelayTicks = noteOnEvent.ticks - startTicks
            const noteOnDelayTime = Math.max(
              0,
              ticksToSeconds(
                noteOnDelayTicks,
                this.player.bpm,
                this.player.ppq,
              ),
            )

            synthesizer.noteOn({
              ...noteOnEvent,
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

            synthesizer.noteOff({
              ...noteOffEvent,
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

  getSong() {
    return this.song
  }
}

export function createEngine(config?: EngineConfig): IEngine {
  const song = createSong()
  return new Engine(song, config)
}

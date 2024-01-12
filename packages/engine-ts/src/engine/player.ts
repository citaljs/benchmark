import {
  DEFAULT_BPM,
  DEFAULT_UPDATE_INTERVAL_TIME as DEFAULT_INTERVAL_TIME,
  DEFAULT_PPQ,
  millisecondsToTicks,
} from '../shared'

type OnInterval = (time: { ticks: number; seconds: number }) => void

export interface IPlayer {
  ticks: number
  seconds: number
  bpm: number
  ppq: number
  playing: boolean
  play: () => void
  stop: () => void
  onInterval?: OnInterval
}

interface PlayerConfig
  extends Partial<{
    bpm: number
    ppq: number
    intervalTime: number
  }> {}

export class Player implements IPlayer {
  playing: boolean
  ticks: number
  seconds: number
  bpm: number
  ppq: number
  private prevTime?: number
  private readonly intervalTime: number
  private intervalId?: NodeJS.Timeout
  onInterval?: OnInterval

  constructor(config?: PlayerConfig) {
    this.playing = false
    this.ticks = 0
    this.seconds = 0
    this.bpm = config?.bpm ?? DEFAULT_BPM
    this.ppq = config?.ppq ?? DEFAULT_PPQ
    this.intervalTime = config?.intervalTime ?? DEFAULT_INTERVAL_TIME
    this.intervalId = undefined
  }

  play(): void {
    if (this.playing) {
      console.warn('Player is already playing.')
      return
    }

    this.playing = true
    this.intervalId = setInterval(() => {
      this.next()
    }, this.intervalTime)
  }

  private next(): void {
    const timestamp = performance.now()
    if (this.prevTime === undefined) {
      this.prevTime = timestamp
    }

    const deltaTime = timestamp - this.prevTime
    const deltaTicks = Math.max(
      0,
      millisecondsToTicks(deltaTime, this.bpm, this.ppq),
    )

    this.ticks += deltaTicks
    this.seconds += deltaTime / 1000

    if (this.onInterval != null) {
      this.onInterval({ ticks: this.ticks, seconds: this.seconds })
    }

    this.prevTime = timestamp
  }

  stop(): void {
    this.playing = false
    this.ticks = 0
    this.seconds = 0
    this.prevTime = undefined

    if (this.intervalId != null) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
  }
}

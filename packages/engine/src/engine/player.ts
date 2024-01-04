import {
  DEFAULT_BPM,
  DEFAULT_PPQ,
  DEFAULT_UPDATE_INTERVAL_TIME,
  millisecondsToTicks,
} from '../shared'

export interface Player {
  ticks: number
  seconds: number
  bpm: number
  ppq: number
  playing: boolean
  play: () => void
  stop: () => void
  onUpdate?: OnUpdate
}

type OnUpdate = (time: { ticks: number; seconds: number }) => void

interface PlayerConfig
  extends Partial<{
    bpm: number
    ppq: number
    updateIntervalTime: number
  }> {}

export class PlayerImpl implements Player {
  playing: boolean
  ticks: number
  seconds: number
  bpm: number
  ppq: number
  private prevTime?: number
  private readonly updateIntervalTime: number
  private intervalId?: NodeJS.Timeout
  onUpdate?: OnUpdate

  constructor(config?: PlayerConfig) {
    this.playing = false
    this.ticks = 0
    this.seconds = 0
    this.bpm = config?.bpm ?? DEFAULT_BPM
    this.ppq = config?.ppq ?? DEFAULT_PPQ
    this.updateIntervalTime =
      config?.updateIntervalTime ?? DEFAULT_UPDATE_INTERVAL_TIME
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
    }, this.updateIntervalTime)
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

    if (this.onUpdate != null) {
      this.onUpdate({ ticks: this.ticks, seconds: this.seconds })
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

import { noteNumberToFrequency } from './utils'

interface NoteOn {
  noteId: string
  type: 'NoteOn'
  ticks: number
  noteNumber: number
  velocity: number
  delayTime: number
}

interface NoteOff {
  noteId: string
  type: 'NoteOff'
  ticks: number
  noteNumber: number
  delayTime: number
}

export class SquareSynthesizer {
  private audioContext: AudioContext
  private voices: Map<string, OscillatorNode>
  private voiceQueue: string[]
  private maxVoices: number
  private outputNode: AudioNode

  constructor(maxVoices: number = 8) {
    this.audioContext = new AudioContext()
    this.voices = new Map()
    this.voiceQueue = []
    this.maxVoices = maxVoices
    this.outputNode = this.audioContext.createGain()
    this.outputNode.connect(this.audioContext.destination)
  }

  getNode() {
    return this.outputNode
  }

  noteOn(event: NoteOn) {
    if (this.voices.size >= this.maxVoices) {
      this.removeOldestVoice()
    }

    const frequency = noteNumberToFrequency(event.noteNumber)
    const oscillator = this.audioContext.createOscillator()
    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime + event.delayTime / 1000,
    )

    const gainNode = this.audioContext.createGain()
    gainNode.gain.setValueAtTime(
      event.velocity / 127,
      this.audioContext.currentTime + event.delayTime / 1000,
    )

    oscillator.connect(gainNode).connect(this.outputNode)
    oscillator.start(this.audioContext.currentTime + event.delayTime)

    this.voices.set(event.noteId, oscillator)
    this.voiceQueue.push(event.noteId)
  }

  noteOff(event: NoteOff) {
    setTimeout(() => {
      this.removeVoice(event.noteId)
    }, event.delayTime * 1000)
  }

  private removeOldestVoice() {
    const oldestVoiceId = this.voiceQueue.shift()
    if (oldestVoiceId) {
      this.removeVoice(oldestVoiceId)
    }
  }

  private removeVoice(noteId: string) {
    const oscillator = this.voices.get(noteId)
    if (oscillator) {
      oscillator.stop()
      oscillator.disconnect()
      this.voices.delete(noteId)
    }
  }
}

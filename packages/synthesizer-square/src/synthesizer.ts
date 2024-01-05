import {
  ISynthesizer,
  NoteOff,
  NoteOn,
} from '@architecture-benchmark/synthesizer-base'
import { noteNumberToFrequency } from './utils'

export class SquareSynthesizer implements ISynthesizer {
  private context: AudioContext
  private node: AudioNode
  private voices: Map<string, OscillatorNode>
  private voiceQueue: string[]
  private maxVoices: number

  constructor(context: AudioContext, maxVoices: number = 8) {
    this.context = context
    this.voices = new Map()
    this.voiceQueue = []
    this.maxVoices = maxVoices
    this.node = this.context.createGain()
    this.node.connect(this.context.destination)
  }

  getContext() {
    return this.context
  }

  getNode() {
    return this.node
  }

  noteOn(event: NoteOn) {
    if (this.voices.size >= this.maxVoices) {
      this.removeOldestVoice()
    }

    const frequency = noteNumberToFrequency(event.noteNumber)
    const oscillator = this.context.createOscillator()
    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(
      frequency,
      this.context.currentTime + event.delayTime / 1000,
    )

    const gainNode = this.context.createGain()
    gainNode.gain.setValueAtTime(
      event.velocity / 127,
      this.context.currentTime + event.delayTime / 1000,
    )

    oscillator.connect(gainNode).connect(this.node)
    oscillator.start(this.context.currentTime + event.delayTime)

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

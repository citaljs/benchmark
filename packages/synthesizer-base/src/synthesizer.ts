export interface NoteOn {
  noteId: string
  type: 'NoteOn'
  ticks: number
  noteNumber: number
  velocity: number
  delayTime: number
}

export interface NoteOff {
  noteId: string
  type: 'NoteOff'
  ticks: number
  noteNumber: number
  delayTime: number
}

export interface ISynthesizer {
  getContext(): AudioContext
  getNode(): AudioNode
  noteOn(event: NoteOn): void
  noteOff(event: NoteOff): void
}

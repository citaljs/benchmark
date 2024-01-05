export function isPowerOfTwo(n: number): boolean {
  return n !== 0 && (n & (n - 1)) === 0
}

export function ticksToSeconds(ticks: number, bpm: number, ppq: number) {
  return (ticks * (60 / bpm)) / ppq
}

export function ticksToMilliseconds(ticks: number, bpm: number, ppq: number) {
  return ticksToSeconds(ticks, bpm, ppq) * 1000
}

export function secondsToTicks(seconds: number, bpm: number, ppq: number) {
  return Math.floor((seconds / (60 / bpm)) * ppq)
}

export function millisecondsToTicks(
  milliseconds: number,
  bpm: number,
  ppq: number,
) {
  return secondsToTicks(milliseconds / 1000, bpm, ppq)
}

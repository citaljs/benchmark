import { hrtime } from 'process'

interface BenchmarkOptions {
  sampleSize?: number
  sampleCount?: number
  maxTime?: number
  onIterationStart?: () => void
  onIterationEnd?: () => void
  onSampleStart?: () => void
  onSampleEnd?: () => void
}

interface BenchmarkResult {
  elapsedTimes: bigint[]
  samples: number
  iters: number
}

interface BenchmarkMetrics {
  fastest: bigint
  slowest: bigint
  median: bigint
  mean: bigint
  samples: number
  iters: number
}

function secondsToMilliseconds(seconds: number) {
  return seconds * 1000
}

function formatTime(ns: bigint): string {
  const oneSecond = BigInt(1_000_000_000)
  if (ns >= oneSecond) {
    const durationInSeconds = Number(ns) / 1_000_000_000
    return `${durationInSeconds.toFixed(1)} s`
  }

  const oneMillisecond = BigInt(1_000_000)
  if (ns >= oneMillisecond) {
    const durationInMilliseconds = Number(ns) / 1_000_000
    return `${durationInMilliseconds.toFixed(1)} ms`
  }

  const oneMicrosecond = BigInt(1_000)
  if (ns >= oneMicrosecond) {
    const durationInMicroseconds = Number(ns) / 1_000
    return `${durationInMicroseconds.toFixed(1)} µs`
  }

  return `${Number(ns).toFixed(1)} ns`
}

function recordSampleTime(
  fn: () => void,
  sampleSize: number,
  onIterationStart?: () => void,
  onIterationEnd?: () => void,
) {
  let elapsed = 0n

  for (let i = 0; i < sampleSize; i += 1) {
    onIterationStart?.()

    const start = hrtime.bigint()
    fn()
    const end = hrtime.bigint()

    elapsed += end - start

    onIterationEnd?.()
  }

  return elapsed
}

export function runBenchmark(
  fn: () => void,
  options?: BenchmarkOptions,
): BenchmarkResult {
  const {
    sampleSize = 100,
    sampleCount,
    maxTime = 1,
    onIterationStart,
    onIterationEnd,
    onSampleStart,
    onSampleEnd,
  } = options ?? {
    args: undefined,
  }

  let samples = 0
  const elapsedTimes: bigint[] = []
  const maxTimeMs = secondsToMilliseconds(maxTime)

  const startTime = performance.now()
  while (sampleCount === undefined || samples < sampleCount) {
    if (performance.now() - startTime > maxTimeMs) {
      break
    }

    onSampleStart?.()

    const elapsed = recordSampleTime(
      fn,
      sampleSize,
      onIterationStart,
      onIterationEnd,
    )
    elapsedTimes.push(elapsed)

    onSampleEnd?.()

    samples += 1
  }

  if (elapsedTimes.length === 0) {
    throw new Error('No samples were collected')
  }

  return {
    elapsedTimes,
    samples,
    iters: sampleSize * samples,
  }
}

export function computeMetrics(result: BenchmarkResult): BenchmarkMetrics {
  const { elapsedTimes, samples, iters } = result

  elapsedTimes.sort((a, b) => Number(a - b))
  const fastest = elapsedTimes[0]
  const slowest = elapsedTimes[elapsedTimes.length - 1]
  const median = elapsedTimes[Math.floor(elapsedTimes.length / 2)]
  const mean =
    elapsedTimes.reduce((a, b) => a + b, 0n) / BigInt(elapsedTimes.length)

  return {
    fastest,
    slowest,
    median,
    mean,
    samples,
    iters,
  }
}

export function printMetrics(metrics: BenchmarkMetrics, label: string) {
  const { fastest, slowest, median, mean, samples, iters } = metrics

  console.log(
    `[${label}] fastest: ${formatTime(fastest)}, slowest: ${formatTime(
      slowest,
    )}, median: ${formatTime(median)}, mean: ${formatTime(
      mean,
    )}, samples: ${samples}, iters: ${iters}`,
  )
}

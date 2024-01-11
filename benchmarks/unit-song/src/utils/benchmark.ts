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
  elapsedTimes: number[]
  samples: number
  iters: number
}

interface BenchmarkMetrics {
  fastest: number
  slowest: number
  median: number
  mean: number
  samples: number
  iters: number
}

function secondsToMilliseconds(seconds: number) {
  return seconds * 1000
}

function recordSampleTime(
  fn: () => void,
  sampleSize: number,
  onIterationStart?: () => void,
  onIterationEnd?: () => void,
) {
  let elapsed = 0

  for (let i = 0; i < sampleSize; i += 1) {
    onIterationStart?.()

    const start = hrtime.bigint()
    fn()
    const end = hrtime.bigint()

    elapsed += Number(end - start)

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
  const elapsedTimes: number[] = []
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

  elapsedTimes.sort((a, b) => a - b)
  const fastest = elapsedTimes[0]
  const slowest = elapsedTimes[elapsedTimes.length - 1]
  const median = elapsedTimes[Math.floor(elapsedTimes.length / 2)]
  const mean = elapsedTimes.reduce((a, b) => a + b, 0) / elapsedTimes.length

  return {
    fastest,
    slowest,
    median,
    mean,
    samples,
    iters,
  }
}

export function printMetrics(metrics: BenchmarkMetrics, name: string) {
  const { fastest, slowest, median, mean, samples, iters } = metrics

  console.log(
    `[${name}] fastest: ${fastest.toFixed(1)}ns, slowest: ${slowest.toFixed(
      1,
    )}ns, median: ${median.toFixed(1)}ns, mean: ${mean.toFixed(
      1,
    )}ns, samples: ${samples}, iters: ${iters}`,
  )
}

import { runAddEventBenchmarks } from './benchmarks/add-event'
import { runGetEventsBenchmarks } from './benchmarks/get-events'
import { runRemoveEventBenchmarks } from './benchmarks/remove-event'
import { runUpdateEventBenchmarks } from './benchmarks/update-event'

runGetEventsBenchmarks()
runAddEventBenchmarks()
runUpdateEventBenchmarks()
runRemoveEventBenchmarks()

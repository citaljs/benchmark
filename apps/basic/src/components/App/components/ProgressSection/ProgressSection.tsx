import { IEngine } from '@benchmark/engine-ts'
import { H2 } from '~/components/ui/h2'
import { ProgressBlock } from './ProgressBlock'
import { useUpdateCurrentSeconds } from './useUpdateCurrentSeconds'
import { useUpdateCurrentTicks } from './useUpdateCurrentTicks'

interface ProgressSectionProps {
  engine: IEngine
}

export function ProgressSection({ engine }: ProgressSectionProps) {
  const currentTicksRef = useUpdateCurrentTicks(engine)
  const currentSecondsRef = useUpdateCurrentSeconds(engine)

  return (
    <div>
      <H2>Progress</H2>

      <div className="mt-4 max-w-[16rem]">
        <ProgressBlock ref={currentTicksRef} label="Ticks" />
        <ProgressBlock ref={currentSecondsRef} label="Seconds" />
      </div>
    </div>
  )
}

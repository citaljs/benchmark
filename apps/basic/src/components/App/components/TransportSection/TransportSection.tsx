import { Engine } from '@architecture-benchmark/engine-ts'
import { useCallback } from 'react'
import { Button } from '~/components/ui/button'
import { H2 } from '~/components/ui/h2'

interface TransportSectionProps {
  engine: Engine
}

export function TransportSection({ engine }: TransportSectionProps) {
  const play = useCallback(() => {
    engine.play()
  }, [])

  const stop = useCallback(() => {
    engine.stop()
  }, [])

  return (
    <div>
      <H2>Transport</H2>

      <div className="mt-4 flex space-x-2">
        <Button onClick={play}>Play</Button>
        <Button variant="outline" onClick={stop}>
          Stop
        </Button>
      </div>
    </div>
  )
}

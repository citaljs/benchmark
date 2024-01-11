import { Engine } from '@benchmark/engine-ts'
import { useEffect, useRef } from 'react'

type UseUpdateCurrentTicks = (
  engine: Engine,
) => React.RefObject<HTMLSpanElement>

export const useUpdateCurrentTicks: UseUpdateCurrentTicks = (engine) => {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    function update() {
      if (ref.current) {
        const newText = engine.getCurrentTicks().toString()

        if (ref.current.innerText !== newText) {
          ref.current.innerText = newText
        }
      }

      requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  }, [])

  return ref
}

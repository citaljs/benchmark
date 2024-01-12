import { IEngine } from '@benchmark/engine-ts'
import { useEffect, useRef } from 'react'

type UseUpdateCurrentSeconds = (
  engine: IEngine,
) => React.RefObject<HTMLSpanElement>

export const useUpdateCurrentSeconds: UseUpdateCurrentSeconds = (engine) => {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    function update() {
      if (ref.current) {
        const newText = engine.getCurrentSeconds().toFixed(2)

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

import { ISong } from '@architecture-benchmark/song-ts'
import { useCallback } from 'react'
import { Button } from '~/components/ui/button'

interface RemoveAllEventsProps {
  song: ISong
  disabled?: boolean
  onRemove?: () => void
}

export function RemoveAllEvents({
  song,
  disabled,
  onRemove,
}: RemoveAllEventsProps) {
  const remove = useCallback(() => {
    const eventIds = song.getEvents().map((event) => event.id)
    song.removeEvents(eventIds)
    onRemove?.()
  }, [onRemove])

  return (
    <Button disabled={disabled} onClick={remove}>
      Remove all events
    </Button>
  )
}

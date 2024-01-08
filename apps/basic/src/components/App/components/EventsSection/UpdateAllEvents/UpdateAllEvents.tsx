import { EventUpdate } from '@architecture-benchmark/event-ts'
import { ISong } from '@architecture-benchmark/song-ts'
import { useCallback, useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { UpdateAllEventsForm } from './UpdateAllEventsForm'
import { FormValues } from './formSchema'

interface UpdateAllEventsProps {
  song: ISong
  disabled?: boolean
  onUpdate?: () => void
}

export function UpdateAllEvents({
  song,
  disabled,
  onUpdate,
}: UpdateAllEventsProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = useCallback(
    (values: FormValues) => {
      const newEvents: EventUpdate[] = song.getEvents().map((event) => ({
        id: event.id,
        ticks: values.ticks,
        duration: values.duration,
        noteNumber: values.noteNumber,
        velocity: values.velocity,
        trackId: event.id,
      }))
      song.updateEvents(newEvents)
      onUpdate?.()
      setOpen(false)
    },
    [onUpdate],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>Update all events</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update all events</DialogTitle>
        </DialogHeader>
        <UpdateAllEventsForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

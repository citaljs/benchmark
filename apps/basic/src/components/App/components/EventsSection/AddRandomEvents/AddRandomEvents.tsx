import { Note } from '@architecture-benchmark/event-ts'
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
import { generateRandomString } from '~/utils/random'
import { AddRandomEventsForm } from './AddRandomEventsForm'
import { FormValues } from './formSchema'

interface AddRandomEventsProps {
  song: ISong
  onAdd?: () => void
}

export function AddRandomEvents({ song, onAdd }: AddRandomEventsProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = useCallback(
    (values: FormValues) => {
      const events = Array.from({ length: values.numEvents }, () => {
        const ticks = Math.floor(
          Math.random() * (values.ticksRange.end - values.ticksRange.start) +
            values.ticksRange.start,
        )

        const duration = Math.floor(
          Math.random() *
            (values.durationRange.end - values.durationRange.start) +
            values.durationRange.start,
        )

        const noteNumber = Math.floor(
          Math.random() *
            (values.noteNumberRange.end - values.noteNumberRange.start) +
            values.noteNumberRange.start,
        )

        const velocity = Math.floor(
          Math.random() *
            (values.velocityRange.end - values.velocityRange.start) +
            values.velocityRange.start,
        )

        const event: Note = {
          id: generateRandomString(),
          kind: 'Note',
          ticks,
          duration,
          noteNumber,
          velocity,
          trackId: song.getTracks()[0].getId(), // TODO: random track
        }

        return event
      })

      song.addEvents(events)
      onAdd?.()
      setOpen(false)
    },
    [onAdd],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add random events</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add random events</DialogTitle>
        </DialogHeader>
        <AddRandomEventsForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

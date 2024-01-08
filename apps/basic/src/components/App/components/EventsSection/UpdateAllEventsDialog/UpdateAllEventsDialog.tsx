import { EventUpdate } from '@architecture-benchmark/event-ts'
import { ISong } from '@architecture-benchmark/song-ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Form, FormItem, FormLabel } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { ErrorMessage } from '~/components/ui/message'
import { FormValues, formSchema } from './formSchema'
import { useUpdateAllEventsStore } from './useUpdateAllEventsStore'

interface UpdateAllEventsDialogProps {
  song: ISong
  onUpdate?: () => void
}

export function UpdateAllEventsDialog({
  song,
  onUpdate,
}: UpdateAllEventsDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })
  const { formState, handleSubmit, register, reset } = form

  const { isOpen, onOpenChange } = useUpdateAllEventsStore()
  const _onOpenChange = useCallback(
    (isOpen: boolean) => {
      onOpenChange(isOpen)

      if (!isOpen) {
        reset()
      }
    },
    [onOpenChange, reset],
  )

  const onSubmit = useCallback(
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
      _onOpenChange(false)
    },
    [onUpdate],
  )

  return (
    <Dialog open={isOpen} onOpenChange={_onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update all events</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <FormItem>
                <FormLabel>Ticks</FormLabel>
                <Input {...register('ticks')} />
                <ErrorMessage>{formState.errors.ticks?.message}</ErrorMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Duration</FormLabel>
                <Input {...register('duration')} />
                <ErrorMessage>
                  {formState.errors.duration?.message}
                </ErrorMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Note number</FormLabel>
                <Input {...register('noteNumber')} />
                <ErrorMessage>
                  {formState.errors.noteNumber?.message}
                </ErrorMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Velocity</FormLabel>
                <Input {...register('velocity')} />
                <ErrorMessage>
                  {formState.errors.velocity?.message}
                </ErrorMessage>
              </FormItem>
            </div>

            <div className="text-right mt-4">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

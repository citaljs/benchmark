import { Note } from '@architecture-benchmark/event-ts'
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
import { generateRandomString } from '~/utils/random'
import { FormValues, formSchema } from './formSchema'
import { useAddRandomEventsStore } from './useAddRandomEventsStore'

interface AddRandomEventsDialogProps {
  song: ISong
  onAdd?: () => void
}

export function AddRandomEventsDialog({
  song,
  onAdd,
}: AddRandomEventsDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })
  const { formState, handleSubmit, register, reset } = form

  const { isOpen, onOpenChange } = useAddRandomEventsStore()
  const _onOpenChange = useCallback(
    (isOpen: boolean) => {
      onOpenChange(isOpen)

      if (!isOpen) {
        reset()
      }
    },
    [reset],
  )

  const onSubmit = useCallback(
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
      _onOpenChange(false)
    },
    [onAdd, _onOpenChange],
  )

  return (
    <Dialog open={isOpen} onOpenChange={_onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add random events</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <FormItem>
                <FormLabel>Number of events</FormLabel>
                <Input {...register('numEvents')} />
                <ErrorMessage>
                  {formState.errors.numEvents?.message}
                </ErrorMessage>
              </FormItem>

              <FormItem className="col-start-1">
                <FormLabel>Ticks range</FormLabel>
                <div className="flex justify-center items-center space-x-2">
                  <Input placeholder="0" {...register('ticksRange.start')} />
                  <span>~</span>
                  <Input
                    placeholder="1920 * 16"
                    {...form.register('ticksRange.end')}
                  />
                </div>
                <ErrorMessage>
                  {formState.errors.ticksRange?.start?.message ??
                    formState.errors.ticksRange?.end?.message}
                </ErrorMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Duration range</FormLabel>
                <div className="flex justify-center items-center space-x-2">
                  <Input placeholder="0" {...register('durationRange.start')} />
                  <span>~</span>
                  <Input
                    placeholder="1920"
                    {...register('durationRange.end')}
                  />
                </div>
                <ErrorMessage>
                  {formState.errors.durationRange?.start?.message ??
                    formState.errors.durationRange?.end?.message}
                </ErrorMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Note number range</FormLabel>
                <div className="flex justify-center items-center space-x-2">
                  <Input
                    placeholder="0"
                    {...register('noteNumberRange.start')}
                  />
                  <span>~</span>
                  <Input
                    placeholder="127"
                    {...register('noteNumberRange.end')}
                  />
                </div>
                <ErrorMessage>
                  {formState.errors.noteNumberRange?.start?.message ??
                    formState.errors.noteNumberRange?.end?.message}
                </ErrorMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Velocity range</FormLabel>
                <div className="flex justify-center items-center space-x-2">
                  <Input placeholder="0" {...register('velocityRange.start')} />
                  <span>~</span>
                  <Input placeholder="127" {...register('velocityRange.end')} />
                </div>
                <ErrorMessage>
                  {formState.errors.velocityRange?.start?.message ??
                    formState.errors.velocityRange?.end?.message}
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

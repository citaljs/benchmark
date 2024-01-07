import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { Form, FormItem, FormLabel } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { ErrorMessage } from '~/components/ui/message'
import { FormValues, formSchema } from './formSchema'

interface AddRandomEventsDialogContentProps {
  onSubmit: (values: FormValues) => void
}

export function AddRandomEventsDialogContent({
  onSubmit,
}: AddRandomEventsDialogContentProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const { formState, handleSubmit, register } = form

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <FormItem>
            <FormLabel>Number of events</FormLabel>
            <Input {...register('numEvents')} />
            <ErrorMessage>{formState.errors.numEvents?.message}</ErrorMessage>
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
              <Input placeholder="1920" {...register('durationRange.end')} />
            </div>
            <ErrorMessage>
              {formState.errors.durationRange?.start?.message ??
                formState.errors.durationRange?.end?.message}
            </ErrorMessage>
          </FormItem>

          <FormItem>
            <FormLabel>Note number range</FormLabel>
            <div className="flex justify-center items-center space-x-2">
              <Input placeholder="0" {...register('noteNumberRange.start')} />
              <span>~</span>
              <Input placeholder="127" {...register('noteNumberRange.end')} />
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
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { Form, FormItem, FormLabel } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { ErrorMessage } from '~/components/ui/message'
import { FormValues, formSchema } from './formSchema'

interface UpdateAllEventsFormProps {
  onSubmit: (values: FormValues) => void
}

export function UpdateAllEventsForm({ onSubmit }: UpdateAllEventsFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const { formState, handleSubmit, register } = form

  return (
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
            <ErrorMessage>{formState.errors.duration?.message}</ErrorMessage>
          </FormItem>

          <FormItem>
            <FormLabel>Note number</FormLabel>
            <Input {...register('noteNumber')} />
            <ErrorMessage>{formState.errors.noteNumber?.message}</ErrorMessage>
          </FormItem>

          <FormItem>
            <FormLabel>Velocity</FormLabel>
            <Input {...register('velocity')} />
            <ErrorMessage>{formState.errors.velocity?.message}</ErrorMessage>
          </FormItem>
        </div>

        <div className="text-right mt-4">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  )
}

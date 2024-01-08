import * as z from 'zod'

function isUnsignedInteger(value: unknown): value is number {
  return value !== '' && Number.isInteger(Number(value)) && Number(value) >= 0
}

function is7bitInteger(value: unknown): value is number {
  return (
    value !== '' &&
    Number.isInteger(Number(value)) &&
    Number(value) >= 0 &&
    Number(value) <= 127
  )
}

export const formSchema = z.object({
  ticks: z
    .string()
    .refine((value) => isUnsignedInteger(value), {
      message: 'Must be a unsigned integer.',
    })
    .transform((value) => Number(value)),

  duration: z
    .string()
    .refine((value) => isUnsignedInteger(value), {
      message: 'Must be a unsigned integer.',
    })
    .transform((value) => Number(value)),

  noteNumber: z
    .string()
    .refine((value) => is7bitInteger(value), {
      message: 'Must be in range 0-127.',
    })
    .transform((value) => Number(value)),

  velocity: z
    .string()
    .refine((value) => is7bitInteger(value), {
      message: 'Must be in range 0-127.',
    })
    .transform((value) => Number(value)),
})

export type FormValues = z.infer<typeof formSchema>

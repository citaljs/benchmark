import * as z from 'zod'

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(Number(value)) && Number(value) > 0
}

function isUnsignedInteger(value: unknown): value is number {
  return Number.isInteger(Number(value)) && Number(value) >= 0
}

function is7bitInteger(value: unknown): value is number {
  return (
    Number.isInteger(Number(value)) &&
    Number(value) >= 0 &&
    Number(value) <= 127
  )
}

export const formSchema = z.object({
  numEvents: z
    .string()
    .refine((value) => isPositiveInteger(value), {
      message: 'Must be a positive integer.',
    })
    .transform((value) => Number(value)),

  ticksRange: z
    .object({
      start: z
        .string()
        .refine((value) => value === '' || isUnsignedInteger(value), {
          message: 'Must be a unsigned integer.',
        })
        .transform((value) => (value === '' ? 0 : Number(value))),
      end: z
        .string()
        .refine((value) => value === '' || isUnsignedInteger(value), {
          message: 'Must be a unsigned integer.',
        })
        .transform((value) => (value === '' ? 1920 * 16 : Number(value))),
    })
    .refine((ticksRange) => ticksRange.start <= ticksRange.end, {
      message: 'Range start must be less than or equal to end.',
    }),

  durationRange: z
    .object({
      start: z
        .string()
        .refine((value) => value === '' || isUnsignedInteger(value), {
          message: 'Must be a unsigned integer.',
        })
        .transform((value) => (value === '' ? 0 : Number(value))),
      end: z
        .string()
        .refine((value) => value === '' || isUnsignedInteger(value), {
          message: 'Must be a unsigned integer.',
        })
        .transform((value) => (value === '' ? 1920 : Number(value))),
    })
    .refine((durationRange) => durationRange.start <= durationRange.end, {
      message: 'Range start must be less than or equal to end.',
    }),

  noteNumberRange: z
    .object({
      start: z
        .string()
        .refine((value) => value === '' || is7bitInteger(value), {
          message: 'Must be in range 0-127.',
        })
        .transform((value) => (value === '' ? 0 : Number(value))),
      end: z
        .string()
        .refine((value) => value === '' || is7bitInteger(value), {
          message: 'Must be in range 0-127.',
        })
        .transform((value) => (value === '' ? 127 : Number(value))),
    })
    .refine((noteNumberRange) => noteNumberRange.start <= noteNumberRange.end, {
      message: 'Range start must be less than or equal to end.',
    }),

  velocityRange: z
    .object({
      start: z
        .string()
        .refine((value) => value === '' || is7bitInteger(value), {
          message: 'Must be in range 0-127.',
        })
        .transform((value) => (value === '' ? 0 : Number(value))),
      end: z
        .string()
        .refine((value) => value === '' || is7bitInteger(value), {
          message: 'Must be in range 0-127.',
        })
        .transform((value) => (value === '' ? 127 : Number(value))),
    })
    .refine((velocityRange) => velocityRange.start <= velocityRange.end, {
      message: 'Range start must be less than or equal to end.',
    }),
})

export type FormValues = z.infer<typeof formSchema>

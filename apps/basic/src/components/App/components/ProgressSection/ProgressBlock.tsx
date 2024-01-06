import { forwardRef } from 'react'

interface ProgressBlockProps {
  label: string
}

export const ProgressBlock = forwardRef<HTMLSpanElement, ProgressBlockProps>(
  ({ label }, ref) => (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-sm font-medium leading-none">{label}</span>
      <span
        ref={ref}
        className="w-12 text-right text-sm text-muted-foreground"
      />
    </div>
  ),
)

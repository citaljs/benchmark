import { forwardRef } from 'react'
import { Label } from '~/components/ui/label'

interface ProgressBlockProps {
  label: string
}

export const ProgressBlock = forwardRef<HTMLSpanElement, ProgressBlockProps>(
  ({ label }, ref) => (
    <div className="flex items-center justify-between py-0.5">
      <Label>{label}</Label>
      <span
        ref={ref}
        className="w-12 text-right text-sm text-muted-foreground"
      />
    </div>
  ),
)

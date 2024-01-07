import * as React from 'react'
import { cn } from '~/lib/utils'

const ErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-[0.8rem] font-medium text-destructive', className)}
    {...props}
  />
))
ErrorMessage.displayName = 'ErrorMessage'

export { ErrorMessage }

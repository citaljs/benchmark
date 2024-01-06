import * as React from 'react'

import { cn } from '~/lib/utils'

export interface H2Props
  extends React.ButtonHTMLAttributes<HTMLHeadingElement> {}

const H2 = React.forwardRef<HTMLHeadingElement, H2Props>(
  ({ className, children, ...props }, ref) => (
    <h2 className={cn('text-2xl font-bold', className)} ref={ref} {...props}>
      {children}
    </h2>
  ),
)
H2.displayName = 'H2'

export { H2 }

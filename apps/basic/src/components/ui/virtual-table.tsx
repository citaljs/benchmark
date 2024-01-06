import { useVirtualizer } from '@tanstack/react-virtual'
import * as React from 'react'

import { cn } from '~/lib/utils'

const VirtualTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
))
VirtualTable.displayName = 'VirtualTable'

const VirtualTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
))
VirtualTableHeader.displayName = 'VirtualTableHeader'

const VirtualTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ children, className, ...props }, ref) => {
  const tbodyRef = React.useRef<HTMLTableSectionElement>(null)

  if (!Array.isArray(children)) {
    return (
      <tbody
        ref={ref}
        className={cn('[&_tr:last-child]:border-0', className)}
        {...props}
      >
        {children}
      </tbody>
    )
  }

  const rowVirtualizer = useVirtualizer({
    count: children.length,
    getScrollElement: () => tbodyRef.current,
    estimateSize: () => 40,
  })

  return (
    <tbody
      // ref={ref}
      ref={tbodyRef}
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
      }}
      className={cn('[&_tr:last-child]:border-0 relative', className)}
      {...props}
    >
      {rowVirtualizer.getVirtualItems().map((virtualItem) => {
        const Child = children[virtualItem.index]
        return (
          <Child
            key={virtualItem.key}
            style={{
              transform: `translateY(${virtualItem.start}px)`,
            }}
          />
        )
      })}
    </tbody>
  )
})
VirtualTableBody.displayName = 'VirtualTableBody'

const VirtualTableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
))
VirtualTableFooter.displayName = 'VirtualTableFooter'

const VirtualTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted absolute top-0 left-0 h-10',
      className,
    )}
    {...props}
  />
))
VirtualTableRow.displayName = 'VirtualTableRow'

const VirtualTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
))
VirtualTableHead.displayName = 'VirtualTableHead'

const VirtualTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
))
VirtualTableCell.displayName = 'VirtualTableCell'

const VirtualTableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
))
VirtualTableCaption.displayName = 'VirtualTableCaption'

export {
  VirtualTable,
  VirtualTableBody,
  VirtualTableCaption,
  VirtualTableCell,
  VirtualTableFooter,
  VirtualTableHead,
  VirtualTableHeader,
  VirtualTableRow,
}

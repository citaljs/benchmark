import { Event } from '@architecture-benchmark/event-ts'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

interface EventTableProps {
  events: Event[]
}

export function EventTable({ events: _events }: EventTableProps) {
  const events = _events.slice(0, 419_428)

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: events.length,
    estimateSize: () => 40,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  return (
    <Table
      containerRef={tableContainerRef}
      classNames={{
        container: 'rounded-md border w-auto max-h-96',
        table: 'grid',
      }}
    >
      <TableHeader className="grid sticky top-0 z-10">
        <TableRow>
          {['ID', 'Ticks', 'Duration', 'Note Number', 'Velocity'].map(
            (label) => (
              <TableHead key={label} className="w-32">
                {label}
              </TableHead>
            ),
          )}
        </TableRow>
      </TableHeader>
      <TableBody
        className="grid relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const event = events[virtualRow.index]
          return (
            <TableRow
              data-index={virtualRow.index}
              key={event.id}
              ref={(node) => rowVirtualizer.measureElement(node)}
              className="absolute h-[40px] w-full"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <TableCell className="w-32">{event.id}</TableCell>
              <TableCell className="w-32">{event.ticks}</TableCell>
              <TableCell className="w-32">{event.duration}</TableCell>
              <TableCell className="w-32">{event.noteNumber}</TableCell>
              <TableCell className="w-32">{event.velocity}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
      <TableFooter className="grid sticky bottom-0 z-10">
        <TableRow>
          <TableCell
            colSpan={5}
            className="text-xs text-muted-foreground flex justify-end"
          >
            Total Events: {events.length.toLocaleString()}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

import { ISong } from '@architecture-benchmark/song-ts'
import { useCallback, useState } from 'react'
import { H2 } from '~/components/ui/h2'
import { useRerender } from '~/hooks/use-rerender'
import { AddRandomEventsDialog } from './AddRandomEventsDialog'
import { EditEventsDropdownMenu } from './EditEventsDropdownMenu'
import { EventTable } from './EventTable'
import { TrackSelect } from './TrackSelect'
import { UpdateAllEventsDialog } from './UpdateAllEventsDialog'

interface EventsSectionProps {
  song: ISong
}

export function EventsSection({ song }: EventsSectionProps) {
  const [selectedItem, setSelectedItem] = useState<string>('all')
  const allEvents = song.getEvents()
  const rerender = useRerender()

  const remove = useCallback(() => {
    const eventIds = song.getEvents().map((event) => event.id)
    song.removeEvents(eventIds)
    rerender()
  }, [rerender])

  return (
    <div>
      <H2>Events</H2>

      <div className="mt-4 flex flex-col space-y-4">
        <div className="flex space-x-4 justify-between">
          <TrackSelect
            value={selectedItem}
            onValueChange={setSelectedItem}
            song={song}
          />

          <EditEventsDropdownMenu
            isEventsEmpty={allEvents.length === 0}
            onRemoveAllEvents={remove}
          />

          <AddRandomEventsDialog song={song} onAdd={rerender} />
          <UpdateAllEventsDialog song={song} onUpdate={rerender} />
        </div>

        {selectedItem === 'all' ? (
          <EventTable events={allEvents} />
        ) : (
          <EventTable events={song.getTrack(selectedItem).getEvents()} />
        )}
      </div>
    </div>
  )
}

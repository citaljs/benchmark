import { ISong } from '@architecture-benchmark/song-ts'
import { useState } from 'react'
import { H2 } from '~/components/ui/h2'
import { useRerender } from '~/hooks/use-rerender'
import { AddRandomEvents } from './AddRandomEvents'
import { EventTable } from './EventTable'
import { RemoveAllEvents } from './RemoveAllEvents'
import { TrackSelect } from './TrackSelect'
import { UpdateAllEvents } from './UpdateAllEvents'

interface EventsSectionProps {
  song: ISong
}

export function EventsSection({ song }: EventsSectionProps) {
  const [selectedItem, setSelectedItem] = useState<string>('all')
  const rerender = useRerender()

  const allEvents = song.getEvents()
  const isEventsEmpty = allEvents.length === 0

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

          <AddRandomEvents song={song} onAdd={rerender} />
          <UpdateAllEvents
            song={song}
            disabled={isEventsEmpty}
            onUpdate={rerender}
          />
          <RemoveAllEvents
            song={song}
            disabled={isEventsEmpty}
            onRemove={rerender}
          />
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

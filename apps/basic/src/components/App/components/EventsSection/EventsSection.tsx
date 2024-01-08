import { ISong } from '@architecture-benchmark/song-ts'
import { useState } from 'react'
import { H2 } from '~/components/ui/h2'
import { useRerender } from '~/hooks/use-rerender'
import { AddRandomEvents } from './AddRandomEvents'
import { EventTable } from './EventTable'
import { TrackSelect } from './TrackSelect'

interface EventsSectionProps {
  song: ISong
}

export function EventsSection({ song }: EventsSectionProps) {
  const [selectedItem, setSelectedItem] = useState<string>('all')
  const rerender = useRerender()

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

          <AddRandomEvents song={song} onAddEvents={rerender} />
        </div>

        {selectedItem === 'all' ? (
          <EventTable events={song.getEvents()} />
        ) : (
          <EventTable events={song.getTrack(selectedItem).getEvents()} />
        )}
      </div>
    </div>
  )
}

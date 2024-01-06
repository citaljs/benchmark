import { ISong } from '@architecture-benchmark/song-ts'
import { useState } from 'react'
import { H2 } from '~/components/ui/h2'
import { EventTable } from './EventTable'
import { TrackSelect } from './TrackSelect'

interface EventsSectionProps {
  song: ISong
}

export function EventsSection({ song }: EventsSectionProps) {
  const [selectedItem, setSelectedItem] = useState<string>('all')

  return (
    <div>
      <H2>Events</H2>

      <div className="mt-4 flex flex-col space-y-4">
        <TrackSelect
          value={selectedItem}
          onValueChange={setSelectedItem}
          song={song}
        />

        {selectedItem === 'all' ? (
          <EventTable events={song.getEvents()} />
        ) : (
          <EventTable events={song.getTrack(selectedItem).getEvents()} />
        )}
      </div>
    </div>
  )
}

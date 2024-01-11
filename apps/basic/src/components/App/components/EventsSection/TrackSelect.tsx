import { ISong } from '@benchmark/song-ts'
import { useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

interface EventsSectionProps {
  value: string
  onValueChange: (value: string) => void
  song: ISong
}

export function TrackSelect({
  value,
  onValueChange,
  song,
}: EventsSectionProps) {
  const selectedItems = useMemo(
    () => [
      {
        value: 'all',
        label: 'All Tracks',
      },
      ...song.getTracks().map((track, index) => ({
        value: track.getId(),
        label: `Track ${index + 1} (ID: ${track.getId()})`,
      })),
    ],
    [],
  )

  return (
    <Select value={value} onValueChange={onValueChange} defaultValue="all">
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {selectedItems.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

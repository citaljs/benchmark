import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useAddRandomEventsStore } from './AddRandomEventsDialog/useAddRandomEventsStore'
import { useUpdateAllEventsStore } from './UpdateAllEventsDialog/useUpdateAllEventsStore'

interface EditEventsDropdownMenuProps {
  isEventsEmpty: boolean
  onRemoveAllEvents?: () => void
}

export function EditEventsDropdownMenu({
  isEventsEmpty,
  onRemoveAllEvents,
}: EditEventsDropdownMenuProps) {
  const addRandomEventsStore = useAddRandomEventsStore()
  const updateAllEventsStore = useUpdateAllEventsStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <DotsHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuLabel>Edit events</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => addRandomEventsStore.open()}>
            Add random events
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateAllEventsStore.open()}
            disabled={isEventsEmpty}
          >
            Update all events
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onRemoveAllEvents}
            disabled={isEventsEmpty}
          >
            Remove all events
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

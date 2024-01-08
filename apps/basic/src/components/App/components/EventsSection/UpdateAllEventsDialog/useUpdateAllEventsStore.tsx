import { create } from 'zustand'

interface UpdateAllEventsStore {
  isOpen: boolean
  open: () => void
  onOpenChange: (isOpen: boolean) => void
}

export const useUpdateAllEventsStore = create<UpdateAllEventsStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  onOpenChange: (isOpen) => set({ isOpen }),
}))

import { create } from 'zustand'

interface AddRandomEventsStore {
  isOpen: boolean
  open: () => void
  onOpenChange: (isOpen: boolean) => void
}

export const useAddRandomEventsStore = create<AddRandomEventsStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  onOpenChange: (isOpen) => set({ isOpen }),
}))

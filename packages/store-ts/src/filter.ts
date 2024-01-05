export type Filter = {
  ticksRange?: TicksRangeFilter
  trackIds?: string[]
}

export interface TicksRangeFilter {
  start: number
  end: number
  withinDuration: boolean
}

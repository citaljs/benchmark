export function range(start: number, end?: number): number[] {
  if (end === undefined) {
    const end = start
    return Array.from({ length: end }, (_, i) => i)
  }

  return Array.from({ length: end - start }, (_, i) => i + start)
}

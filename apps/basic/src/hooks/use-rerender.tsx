import { useReducer } from 'react'
import { generateRandomString } from '~/utils/random'

export function useRerender() {
  const [, rerender] = useReducer(generateRandomString, generateRandomString())
  return rerender
}

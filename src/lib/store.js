import { writable, readable, derived } from "svelte/store";
import allPatterns from './patterns/patterns'
import tripletPatterns from './patterns/triplets'
import { getPatternInfo } from './patterns/patternUtils'

export const counter = writable(0)
export const currentPattern = writable(0)
export const patterns = readable([...allPatterns, ...tripletPatterns])

// Derived store: metadata for the current pattern (totalNotes, durations, beatPositions, etc.)
export const currentPatternInfo = derived(
  [patterns, currentPattern],
  ([$patterns, $currentPattern]) => getPatternInfo($patterns[$currentPattern])
)

export const reps = writable({
  count: 20,
  selected: true
})

export const timer = writable({
  startSeconds: 60,
  currentSeconds: 60,
  selected: false
})
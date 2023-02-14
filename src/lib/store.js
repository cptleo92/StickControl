import { writable, readable } from "svelte/store";
import allPatterns from './patterns/patterns'

export const counter = writable(1)
export const currentPattern = writable(0)
export const patterns = readable(allPatterns)

export const reps = writable({
  count: 20,
  selected: true
})

export const timer = writable({
  startSeconds: 60,
  currentSeconds: 60,
  selected: false
})
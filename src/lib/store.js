import { writable, readable } from "svelte/store";
import allPatterns from './patterns/patterns'

export const counter = writable(0)
export const currentPattern = writable(0)
export const reps = writable(2)
export const patterns = readable(allPatterns)
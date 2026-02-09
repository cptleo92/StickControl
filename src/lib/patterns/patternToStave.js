// Converts a pattern string into VexFlow StaveNote objects for rendering.
// Returns an array of 2 measures, each with { allNotes, beams, tuplets }.

import Vex from "vexflow";
import { parsePattern } from "./patternUtils";
const { StaveNote } = Vex.Flow;

function createNote(char) {
  return char === "r"
    ? new StaveNote({ keys: ["c/5"], duration: "8" })
    : new StaveNote({ keys: ["a/4"], duration: "8" });
}

export const patternToStave = (pattern) => {
  const parsed = parsePattern(pattern);

  return parsed.map(measure => {
    const allNotes = [];
    const beams = [];
    const tuplets = [];

    measure.forEach(group => {
      const notes = [];
      for (const char of group.notes) {
        const note = createNote(char);
        notes.push(note);
        allNotes.push(note);
      }
      beams.push(notes);
      if (group.triplet) {
        tuplets.push(notes);
      }
    });

    return { allNotes, beams, tuplets };
  });
}
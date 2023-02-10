// pattern is a string with 4 groups
// splitting the pattern gives us ["rlrl", "rlrl", "rlrl", "rlrl"]
// we want to map each string to a beam of stave notes

// new StaveNote({ keys: ["c/5"], duration: "8" }),
// new StaveNote({ keys: ["a/4"], duration: "8" }),
import Vex from "vexflow";
const { StaveNote } = Vex.Flow;

export const patternToStave = (pattern) => {
  const groups = pattern.split(" ")

  return groups.map(group => {
    const notes = []
    for (let char of group) {
      char === "r"
        ? notes.push(new StaveNote({ keys: ["c/5"], duration: "8" }))
        : notes.push(new StaveNote({ keys: ["a/4"], duration: "8" }))
    }
    return notes
  })
}
/**
 * Parse a pattern string into structured format.
 *
 * Format: "rlrl (rlr) (lrl) | rlrl (rlr) (lrl)"
 *   | separates measures, () marks triplet groups
 *
 * Returns: array of 2 measures, each measure is an array of groups
 * Group: { notes: string, triplet: boolean }
 */
export function parsePattern(pattern) {
  const measureStrings = pattern.split('|').map(s => s.trim());
  return measureStrings.map(measure => {
    const groups = [];
    const regex = /\(([^)]+)\)|([^\s()]+)/g;
    let match;
    while ((match = regex.exec(measure)) !== null) {
      if (match[1]) {
        groups.push({ notes: match[1], triplet: true });
      } else if (match[2]) {
        groups.push({ notes: match[2], triplet: false });
      }
    }
    return groups;
  });
}

/**
 * Get metadata about a pattern:
 * - totalNotes: total number of notes in the 2-bar pattern
 * - firstMeasureNotes: notes in the first measure
 * - letters: array of individual note characters
 * - durations: array of note durations in beats (0.5 for eighth, 1/3 for triplet)
 * - beatPositions: which note indices fall on beat boundaries (for metronome clicks)
 * - hasTriplets: whether this pattern contains any triplets
 * - parsed: the raw parsed structure
 */
export function getPatternInfo(pattern) {
  const parsed = parsePattern(pattern);

  let totalNotes = 0;
  let firstMeasureNotes = 0;
  const letters = [];
  const durations = []; // in beats

  parsed.forEach((measure, mIdx) => {
    measure.forEach(group => {
      const dur = group.triplet ? 1 / 3 : 0.5;
      for (const char of group.notes) {
        letters.push(char);
        durations.push(dur);
        totalNotes++;
        if (mIdx === 0) firstMeasureNotes++;
      }
    });
  });

  // Compute beat positions (note indices that fall on integer beat boundaries)
  const beatPositions = new Set([0]);
  let cumBeat = 0;
  for (let i = 0; i < durations.length; i++) {
    if (i > 0 && Math.abs(cumBeat - Math.round(cumBeat)) < 0.001) {
      beatPositions.add(i);
    }
    cumBeat += durations[i];
  }

  const hasTriplets = durations.some(d => Math.abs(d - 1 / 3) < 0.001);

  return {
    totalNotes,
    firstMeasureNotes,
    letters,
    durations,
    beatPositions: [...beatPositions],
    hasTriplets,
    parsed
  };
}

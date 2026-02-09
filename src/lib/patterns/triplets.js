// Triplet patterns from page 8 of "Stick Control for the Snare Drummer"
// Format: | separates measures, () marks triplet groups
// Each bar is in 4/4 time (4 beats per bar)
// Eighth note group (e.g. rlrl): 4 notes = 2 beats
// Triplet group (e.g. (rlr)): 3 notes = 1 beat
// Each bar: 4 eighth notes (2 beats) + 2 triplet groups (2 beats) = 4 beats

export default [
  // Exercises 1-12: alternating triplets (rlr/lrl)
  "rlrl (rlr) (lrl) | rlrl (rlr) (lrl)",       // 1
  "lrlr (lrl) (rlr) | lrlr (lrl) (rlr)",       // 2
  "rrll (rlr) (lrl) | rrll (rlr) (lrl)",        // 3
  "llrr (lrl) (rlr) | llrr (lrl) (rlr)",        // 4
  "rlrr (lrl) (rlr) | lrll (rlr) (lrl)",        // 5
  "rllr (lrl) (rlr) | lrrl (rlr) (lrl)",        // 6
  "rrlr (lrl) (rlr) | llrl (rlr) (lrl)",        // 7
  "rrrl (rlr) (lrl) | rrrl (rlr) (lrl)",        // 8
  "lllr (lrl) (rlr) | lllr (lrl) (rlr)",        // 9
  "rlll (rlr) (lrl) | rlll (rlr) (lrl)",        // 10
  "lrrr (lrl) (rlr) | lrrr (lrl) (rlr)",        // 11
  "rrrr (lrl) (rlr) | llll (rlr) (lrl)",        // 12

  // Exercises 13-24: double-stroke triplets (rrl/llr)
  "rlrl (rrl) (rrl) | rlrl (rrl) (rrl)",        // 13*
  "lrlr (llr) (llr) | lrlr (llr) (llr)",        // 14
  "rrll (rrl) (rrl) | rrll (rrl) (rrl)",         // 15
  "llrr (llr) (llr) | llrr (llr) (llr)",         // 16
  "rlrr (llr) (llr) | lrll (rrl) (rrl)",         // 17
  "rllr (llr) (llr) | lrrl (rrl) (rrl)",         // 18
  "rrlr (llr) (llr) | llrl (rrl) (rrl)",          // 19
  "rrrl (rrl) (rrl) | rrrl (rrl) (rrl)",          // 20
  "lllr (llr) (llr) | lllr (llr) (llr)",          // 21
  "rlll (rrl) (rrl) | rlll (rrl) (rrl)",          // 22
  "lrrr (llr) (llr) | lrrr (llr) (llr)",          // 23
  "rrrr (llr) (llr) | llll (rrl) (rrl)",          // 24
]

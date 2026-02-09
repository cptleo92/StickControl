<script>
  import {counter, reps, timer} from '../store';
  import {getPatternInfo} from '../patterns/patternUtils';

  export let pattern;
  export let preview = false;
  export let noteXPositions = [];

  const info = getPatternInfo(pattern);
  const letters = info.letters.map(c => c.toUpperCase());
  const totalNotes = info.totalNotes;

  $: previewClass =
    ($reps.selected && $counter > ($reps.count - 1) * totalNotes) ||
    ($timer.selected && $timer.currentSeconds <= 3)
      ? 'opacity-25'
      : 'opacity-40';

  $: letterStyle = idx => {
    if (noteXPositions.length > idx) {
      // Center each letter on the note's x position (offset ~4px for char width)
      return `left: ${noteXPositions[idx] - 4}px;`;
    }
    return '';
  };

  $: letterClass = idx => {
    const base = 'letter absolute';
    if (preview) return base;
    return `${base} ${
      idx === ($counter - 1) % totalNotes &&
      'text-emerald-800 font-bold translate-y-1 transition-all'
    }`;
  };
</script>

<div
  class={`absolute top-full w-full ${
    preview && previewClass
  } transition-all`}
>
  {#each letters as letter, idx}
    <p class={letterClass(idx)} style={letterStyle(idx)}>
      {letter}
    </p>
  {/each}
</div>

<style>
  p {
    font-family: 'Space Mono', monospace;
  }
</style>

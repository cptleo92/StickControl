<script>
  import {counter, reps, timer} from '../store';

  export let pattern;
  export let preview = false;

  const letters = [];
  for (let char of pattern) {
    if (char !== ' ') letters.push(char.toUpperCase());
  }

  $: previewClass =
    ($reps.selected && $counter > ($reps.count - 1) * 16) ||
    ($timer.selected && $timer.currentSeconds <= 3)
      ? 'opacity-25'
      : 'opacity-40';

  $: letterClass = idx => {
    if (preview) return 'letter mr-[21px]';
    return `letter mr-[21px] ${
      idx === ($counter - 1) % 16 &&
      'text-emerald-800 font-bold translate-y-1 transition-all'
    }`;
  };
</script>

<div
  class={`flex absolute top-full left-4 ${
    preview && previewClass
  } transition-all`}
>
  {#each letters.slice(0, 8) as letter, idx}
    <p class={letterClass(idx)}>
      {letter}
    </p>
  {/each}

  <div class="flex ml-5">
    {#each letters.slice(8) as letter, idx}
      <p class={letterClass(idx + 8)}>
        {letter}
      </p>
    {/each}
  </div>
</div>

<style>
  p {
    font-family: 'Space Mono', monospace;
  }
</style>

<script>
  import {counter, reps} from '../store';

  export let pattern;
  export let preview = false;

  const letters = [];
  for (let char of pattern) {
    if (char !== ' ') letters.push(char.toUpperCase());
  }

  $: previewClass = $counter > ($reps - 1) * 16 ? 'opacity-25' : 'opacity-0';

  $: letterClass = idx => {
    if (preview) return 'mr-[27px]';
    return `mr-[27px] ${
      idx === ($counter - 1) % 16 && 'text-emerald-800 font-bold'
    }`;
  };
</script>

<div
  class={`flex translate-x-[90px] ${preview && previewClass} transition-all`}
>
  {#each letters.slice(0, 8) as letter, idx}
    <div class={letterClass(idx)}>
      {letter}
    </div>
  {/each}

  <div class="flex ml-3">
    {#each letters.slice(8) as letter, idx}
      <div class={letterClass(idx + 8)}>
        {letter}
      </div>
    {/each}
  </div>
</div>

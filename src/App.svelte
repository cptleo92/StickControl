<script>
  import Metronome from './lib/components/Metronome.svelte';
  import Notation from './lib/components/Notation.svelte';
  import NotationPreview from './lib/components/NotationPreview.svelte';

  import {currentPattern} from './lib/store';
</script>

<div class="flex flex-col justify-center my-8 max-w-screen-md m-auto">
  <h1 class="text-center text-5xl my-4 underline">Stick Control</h1>
  <h2 class="text-center text-3xl my-1">for the Snare Drummer</h2>
  <h3 class="text-center text-xl my-1">
    <em>... for the Screen</em>
  </h3>

  <Metronome />

  {#key $currentPattern}
    <Notation />
    <NotationPreview />
  {/key}

  <!-- <a href="https://www.flaticon.com/free-icons/drum" title="drum icons"
    >Drum icons created by Freepik - Flaticon</a
  > -->
</div>

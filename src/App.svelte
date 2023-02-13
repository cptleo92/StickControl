<script>
  import {fly} from 'svelte/transition';
  import {onMount} from 'svelte';
  import Footer from './lib/components/Footer.svelte';
  import Instructions from './lib/components/Instructions.svelte';
  import Metronome from './lib/components/Metronome.svelte';
  import Nav from './lib/components/Nav.svelte';
  import Notation from './lib/components/Notation.svelte';
  import NotationPreview from './lib/components/NotationPreview.svelte';

  import {currentPattern} from './lib/store';

  let ready = false;

  onMount(() => (ready = true));
</script>

<Nav />
{#if ready}
  <div
    class="main box-border flex flex-col justify-center my-8 max-w-screen-md m-auto bg-white p-6 border rounded-md shadow-md"
  >
    <!-- <div class="text-center">
    <h1>Stick Control</h1>
    <h2>for the Snare Drummer</h2>
    <h4>
      <em>... for the Screen</em>
    </h4>
  </div> -->
    <div class="relative border p-2 rounded-md">
      <img class="w-[70%] m-auto" src="/stick-control.png" alt="logo" />
      <h4
        in:fly={{delay: 1000, duration: 1000, x: -50}}
        class="absolute right-36 top-72 font-semibold underline"
      >
        <em>... for the Screen</em>
      </h4>
    </div>
    <Metronome />

    {#key $currentPattern}
      <Notation />
      <NotationPreview />
    {/key}

    <Instructions />
  </div>
  <Footer />
{/if}

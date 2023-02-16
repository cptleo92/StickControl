<script>
  import {fly} from 'svelte/transition';
  import {onMount} from 'svelte';
  import Footer from './lib/components/Footer.svelte';
  import Instructions from './lib/components/Instructions.svelte';
  import Metronome from './lib/components/Metronome.svelte';
  import Nav from './lib/components/Nav.svelte';
  import Notation from './lib/components/Notation.svelte';
  import NotationPreview from './lib/components/NotationPreview.svelte';

  import {currentPattern, patterns} from './lib/store';

  let ready = false;

  onMount(() => (ready = true));
</script>

<Nav />
{#if ready}
  <div
    class="main box-border flex flex-col justify-center my-8 md:max-w-screen-md m-auto bg-white p-8 border rounded-md shadow-md"
  >
    <div class="relative border p-2 rounded-md">
      <img class="w-[60%] m-auto" src="/stick-control.png" alt="logo" />

      <h4
        in:fly={{delay: 1000, duration: 1000, x: -50}}
        class="absolute top-1/2 left-1/2 font-semibold underline "
      >
        <em>... for the Screen</em>
      </h4>
    </div>
    <Metronome />

    {#key $currentPattern}
      <Notation />
      {#if $currentPattern < $patterns.length - 1}
        <NotationPreview />
      {/if}
    {/key}

    <Instructions />
  </div>
  <Footer />
{/if}

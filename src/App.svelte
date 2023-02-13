<script>
  import Footer from './lib/components/Footer.svelte';
  import Instructions from './lib/components/Instructions.svelte';
  import Metronome from './lib/components/Metronome.svelte';
  import Nav from './lib/components/Nav.svelte';
  import Notation from './lib/components/Notation.svelte';
  import NotationPreview from './lib/components/NotationPreview.svelte';

  import {currentPattern} from './lib/store';
</script>

<Nav />
<div
  class="main box-border flex flex-col justify-center my-8 max-w-screen-md m-auto bg-white p-6 border rounded-md shadow-md"
>
  <div class="text-center">
    <h1>Stick Control</h1>
    <h2>for the Snare Drummer</h2>
    <h4>
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

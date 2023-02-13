<script>
  import metronomeSFX from '/metronome.mp3';
  import {counter, reps, currentPattern, patterns} from '../store';

  let bpm = 120;
  let playing = false;
  let intervalId;

  // $: downbeat = $counter % 2 === 0;

  const audio = new Audio(metronomeSFX);

  const togglePlaying = () => {
    if (playing) {
      clearInterval(intervalId);
      playing = false;

      setTimeout(() => {
        $counter = 0;
      }, 400);
    } else {
      intervalId = setInterval(() => {
        // if (downbeat) {
        audio.currentTime = 0;
        audio.play();
        // }

        setTimeout(() => {
          if ($counter > 0 && $counter % ($reps * 16) === 0) {
            $currentPattern = ($currentPattern + 1) % $patterns.length;
            $counter = 0;
          }
          $counter += 1;
        }, 300);
      }, (60 / bpm) * 500);

      playing = true;
    }
  };

  const handleChangeBPM = () => {
    bpm = Math.max(bpm, 30);
    bpm = Math.min(bpm, 240);

    if (playing) {
      togglePlaying();
      togglePlaying();
    }
  };

  const handleChangePattern = () => {
    patternSelect = Math.max(patternSelect, 1);
    patternSelect = Math.min(patternSelect, $patterns.length - 1);

    $currentPattern = patternSelect - 1;
  };

  const handleChangeReps = e => {
    let newReps = Math.max(e.target.value, 1);
    newReps = Math.min(newReps, 30);

    $reps = newReps;
  };

  $: patternSelect = $currentPattern + 1;
</script>

<section class="border mt-8 -mx-6 p-6 bg-slate-300">
  <h2 class="text-center font-semibold">Metronome Settings</h2>
  <div class="flex flex-col items-end my-8">
    <input
      type="range"
      min="30"
      max="240"
      class="slider"
      on:input={handleChangeBPM}
      bind:value={bpm}
    />
    <p>
      BPM:
      <input
        class="text-3xl font-bold border p-1 w-24 text-center ml-2"
        type="number"
        min="30"
        max="240"
        bind:value={bpm}
        on:change={handleChangeBPM}
      />
    </p>

    <input
      type="range"
      min="1"
      max={$patterns.length - 1}
      class="slider"
      bind:value={patternSelect}
      on:input={handleChangePattern}
    />
    <p>
      Current Pattern: <input
        class="text-3xl font-bold border p-1 w-24 text-center ml-2"
        type="number"
        min="1"
        max={$patterns.length - 1}
        bind:value={patternSelect}
        on:change={handleChangePattern}
      />
    </p>

    <input
      type="range"
      min="1"
      max={30}
      class="slider"
      bind:value={$reps}
      on:change={handleChangeReps}
    />
    <p>
      Number of Reps: <input
        class="text-3xl font-bold border p-1 w-24 text-center ml-2"
        type="number"
        min="1"
        max={30}
        bind:value={$reps}
        on:change={handleChangeReps}
      />
    </p>
  </div>

  <div class="flex justify-center">
    <button
      class="bg-slate-100 py-2 px-4 border-black border-2 text-black text-2xl my-4 rounded-md hover:bg-slate-200 transition-all mx-auto"
      on:click={togglePlaying}
    >
      {playing ? 'Stop' : 'Start'}
    </button>
  </div>
</section>

<style>
  .slider {
    width: 100%;
    height: 20px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #04aa6d;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #04aa6d;
    cursor: pointer;
  }
</style>

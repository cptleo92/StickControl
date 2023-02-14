<script>
  import metronomeSFX from '/metronome.mp3';
  import {counter, reps, timer, currentPattern, patterns} from '../store';
  import {fade} from 'svelte/transition';

  let bpm = 120;
  let playing = false;
  let intervalId;

  // loads in an audio click and plays on every other tick
  const audio = new Audio(metronomeSFX);

  $: downbeat = $counter % 2 !== 0;

  $: if (playing && downbeat) {
    audio.currentTime = 0;
    audio.play();
  }

  const handleStart = () => {
    playing ? togglePlaying() : countdownBeforePlaying();
  };

  let countdown = false;
  let countdownSeconds = 3;
  const countdownBeforePlaying = () => {
    countdown = true;

    let countdownInterval = setInterval(() => {
      countdownSeconds--;

      if (countdownSeconds === 0) {
        clearInterval(countdownInterval);
        countdown = false;
        countdownSeconds = 3;
        togglePlaying();
      }
    }, 1000);
  };

  const updateByReps = () => {
    if ($counter > 0 && $counter % ($reps.count * 16) === 0) {
      $currentPattern = ($currentPattern + 1) % $patterns.length;
      $counter = 0;
    }
  };

  const updateTimer = () => {
    if ($timer.currentSeconds !== 0) $timer.currentSeconds -= 1;
  };

  let timerInterval;
  const togglePlaying = () => {
    if (playing) {
      audio.currentTime = 0;
      clearInterval(intervalId);
      clearInterval(timerInterval);
      playing = false;
      $counter = 0;
    } else {
      $timer.currentSeconds = $timer.startSeconds;

      if ($timer.selected) timerInterval = setInterval(updateTimer, 1000);

      /**
       * this interval ticks twice for every beat per minute
       * if the metronome is set to timer mode, additional logic is needed to check
       *   if the pattern needs to be updated
       */

      intervalId = setInterval(() => {
        if ($reps.selected) updateByReps();

        if (
          $counter > 0 &&
          $timer.currentSeconds === 0 &&
          $counter % 16 === 0
        ) {
          $currentPattern = ($currentPattern + 1) % $patterns.length;
          $counter = 0;
          $timer.currentSeconds = $timer.startSeconds;
        }

        $counter++;
      }, (60 / bpm) * 500);

      playing = true;
    }
  };

  const handleChangeBPM = () => {
    bpm = Math.max(bpm, 30);
    bpm = Math.min(bpm, 240);

    if (playing) {
      togglePlaying();
    }
  };

  const handleChangePattern = e => {
    let newPattern = Math.max(e.target.value, 1);
    newPattern = Math.min(newPattern, $patterns.length);

    $currentPattern = newPattern - 1;
  };

  const handleChangeReps = e => {
    let newReps = Math.max(e.target.value, 1);
    newReps = Math.min(newReps, 30);

    $reps.count = newReps;
  };

  const handleChangeTimer = e => {
    let newTimer = Math.max(e.target.value, 1);
    newTimer = Math.min(newTimer, 600);

    $timer.startSeconds = newTimer;
    $timer.currentSeconds = newTimer;
  };

  const handleSelectReps = () => {
    if (playing) togglePlaying();

    $timer.selected = false;
    $reps.selected = true;
  };

  const handleSelectTimer = () => {
    if (playing) togglePlaying();

    $timer.selected = true;
    $reps.selected = false;
  };

  $: patternSelect = $currentPattern + 1;
</script>

<section class="p-6">
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
      max={$patterns.length}
      class="slider"
      bind:value={patternSelect}
      on:input={handleChangePattern}
    />
    <p>
      Current Pattern: <input
        class="text-3xl font-bold border p-1 w-24 text-center ml-2"
        type="number"
        min="1"
        max={$patterns.length}
        bind:value={patternSelect}
        on:change={handleChangePattern}
      />
    </p>

    <div class="grid grid-cols-2 gap-12 w-[100%] mt-4">
      <div
        class={`flex flex-col border-gray-400 border-2 rounded-lg p-8 ${
          $reps.selected && 'bg-green-100'
        }`}
      >
        <p class="flex justify-end items-center">
          Reps (1 - 60): <input
            class="text-3xl font-bold border p-1 w-24 text-center ml-2"
            type="number"
            min="1"
            max="30"
            bind:value={$reps.count}
            on:change={handleChangeReps}
          />
        </p>
        <button
          class="mt-4 border border-gray-400 bg-slate-100 py-2 px-4 rounded-md hover:bg-slate-200 transition-all"
          on:click={handleSelectReps}>Select</button
        >
      </div>

      <div
        class={`flex flex-col border-gray-400 border-2 rounded-lg p-8 ${
          $timer.selected && 'bg-green-100'
        }`}
      >
        <p class="flex justify-end items-center">
          Seconds (1 - 600): <input
            class="text-3xl font-bold border p-1 w-24 text-center ml-2"
            type="number"
            min="1"
            max="600"
            bind:value={$timer.startSeconds}
            on:change={handleChangeTimer}
          />
        </p>
        <button
          class="mt-4 border border-gray-400 bg-slate-100 py-2 px-4 rounded-md hover:bg-slate-200 transition-all"
          on:click={handleSelectTimer}>Select</button
        >
      </div>
    </div>
  </div>

  <div class="flex justify-center">
    <button
      class="bg-slate-100 py-2 px-4 border-black border-2 text-black text-2xl my-4 rounded-md hover:bg-slate-200 transition-all mx-auto"
      on:click={handleStart}
      disabled={countdown}
    >
      {playing ? 'Stop' : 'Start'}
    </button>
  </div>
  {#if countdown}
    <p transition:fade class="text-center text-xl -mb-8">
      Get your sticks ready! <span class="font-bold text-2xl"
        >{countdownSeconds}...</span
      >
    </p>
  {/if}
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

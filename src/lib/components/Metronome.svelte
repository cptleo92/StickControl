<script>
  import metronomeSFX from '/metronome.mp3';
  import {counter, reps, timer, currentPattern, patterns, currentPatternInfo} from '../store';
  import {fade} from 'svelte/transition';

  let bpm = 120;
  let playing = false;

  // --- Web Audio API setup for precise scheduling ---
  let audioCtx = null;
  let clickBuffer = null;

  async function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch(metronomeSFX);
    const arrayBuffer = await response.arrayBuffer();
    clickBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  }

  function playClickAtTime(when) {
    if (!audioCtx || !clickBuffer) return;
    const source = audioCtx.createBufferSource();
    source.buffer = clickBuffer;
    source.connect(audioCtx.destination);
    source.start(when);
  }

  // --- Scheduler state ---
  let schedulerTimer = null;
  let nextNoteTime = 0;       // AudioContext time for the next note
  const scheduleAheadTime = 0.1; // seconds to look ahead
  const lookaheadMs = 25;     // how often to call scheduler (ms)

  /**
   * The scheduler runs on a setInterval and schedules notes into the future
   * using the AudioContext clock. This avoids setTimeout drift entirely.
   */
  function scheduler() {
    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
      const info = $currentPatternInfo;

      // Handle deferred pattern transition from previous tick
      if ($reps.selected && $counter > 0 && $counter % ($reps.count * info.totalNotes) === 0) {
        $currentPattern = ($currentPattern + 1) % $patterns.length;
        $counter = 0;
        return;
      }
      if ($counter > 0 && $timer.currentSeconds === 0 && $counter % info.totalNotes === 0) {
        $currentPattern = ($currentPattern + 1) % $patterns.length;
        $counter = 0;
        $timer.currentSeconds = $timer.startSeconds;
        return;
      }

      const noteIndex = $counter % info.totalNotes;

      // Schedule click sound on beat boundaries
      if (info.beatPositions.includes(noteIndex)) {
        playClickAtTime(nextNoteTime);
      }

      // Advance time by this note's duration in seconds
      const duration = info.durations[noteIndex]; // in beats
      const seconds = (60 / bpm) * duration;
      nextNoteTime += seconds;

      // Advance counter (with Svelte store update)
      $counter++;

      // If counter just reached a transition point, exit so Svelte can render
      // the last note highlight before transitioning on the next tick
      if ($reps.selected && $counter > 0 && $counter % ($reps.count * info.totalNotes) === 0) {
        return;
      }
      if ($counter > 0 && $timer.currentSeconds === 0 && $counter % info.totalNotes === 0) {
        return;
      }
    }
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

  const updateTimer = () => {
    if ($timer.currentSeconds !== 0) $timer.currentSeconds -= 1;
  };

  let timerInterval;
  const togglePlaying = async () => {
    if (playing) {
      clearInterval(schedulerTimer);
      clearInterval(timerInterval);
      schedulerTimer = null;
      playing = false;
      $counter = 0;
    } else {
      await initAudio();
      if (audioCtx.state === 'suspended') await audioCtx.resume();

      $timer.currentSeconds = $timer.startSeconds;
      if ($timer.selected) timerInterval = setInterval(updateTimer, 1000);

      playing = true;
      $counter = 0;
      nextNoteTime = audioCtx.currentTime;
      schedulerTimer = setInterval(scheduler, lookaheadMs);
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

    <div class="flex flex-wrap justify-center gap-12 w-[100%] mt-4">
      <div
        class={`flex flex-col w-[250px] border-gray-400 border-2 rounded-lg p-8 ${
          $reps.selected && 'bg-green-100'
        }`}
      >
        <p class="flex justify-end items-center">
          Repetitions (1 - 60): <input
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
        class={`flex flex-col w-[250px] border-gray-400 border-2 rounded-lg p-8 ${
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

  <p class="hidden max-[580px]:block text-center text-green-600">
    Flip your device to landscape for best results!
  </p>
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

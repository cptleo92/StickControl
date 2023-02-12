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
</script>

<div class="flex justify-center flex-col items-center my-8">
  <label>
    <input
      type="number"
      class="text-black border-black border"
      bind:value={bpm}
    />
    BPM
  </label>

  <div>
    <button
      class="bg-slate-300 py-2 px-4 border-black border-2 text-black my-4 rounded-md"
      on:click={togglePlaying}
    >
      {playing ? 'Stop' : 'Start'}
    </button>
  </div>
</div>

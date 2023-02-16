<script>
  import Vex from 'vexflow';
  import {counter, reps, timer, currentPattern, patterns} from '../store';
  import {patternToStave} from '../patterns/patternToStave';
  import {onMount} from 'svelte';
  import NotationLetters from './NotationLetters.svelte';
  const {Renderer, Stave, Formatter, Beam} = Vex.Flow;

  const staveSize = {
    sm: [],
    md: [],
    lg: [575, 280]
  };

  export const drawNotes = () => {
    const output = document.querySelector('.output');

    // @ts-ignore
    const renderer = new Renderer(output, Renderer.Backends.SVG);

    // calculate how big the staves will be
    const main = document.querySelector('.main');
    const {width} = main.getBoundingClientRect();
    console.log(width);
    const scale = Math.min(1, width / 768);

    // const staveWidth = width / 2.7;
    // const contextWidth = staveWidth * 2 + 25;

    renderer.resize(540, 100);
    const context = renderer.getContext();
    // context.scale(scale, scale);

    const staveMeasure1 = new Stave(0, 0, 265);
    staveMeasure1.setContext(context).draw();

    const staveMeasure2 = new Stave(
      // @ts-ignore
      staveMeasure1.width + staveMeasure1.x,
      0,
      265
    );
    staveMeasure2.setContext(context).draw();

    const notes = patternToStave($patterns[$currentPattern]);

    const beams = notes.map(beam => new Beam(beam));

    Formatter.FormatAndDraw(context, staveMeasure1, notes[0].concat(notes[1]));
    Formatter.FormatAndDraw(context, staveMeasure2, notes[2].concat(notes[3]));

    beams.forEach(b => {
      b.setContext(context).draw();
    });
  };

  onMount(() => drawNotes());
</script>

<div
  class={`m-auto flex items-center justify-center border-2 rounded-full text-2xl my-2 font-bold h-16 w-16 bg-slate-500 text-white ${
    $counter === 0 && 'opacity-0'
  }`}
>
  {$reps.selected ? Math.ceil($counter / 16) : $timer.currentSeconds}
</div>
<div class="flex items-center justify-center">
  <p class={`translate-y-2 text-2xl mr-4`}>
    {$currentPattern < 9 ? '0' : ''}{$currentPattern + 1}
  </p>
  <div class="text-center output relative">
    <NotationLetters pattern={$patterns[$currentPattern]} />
  </div>
</div>

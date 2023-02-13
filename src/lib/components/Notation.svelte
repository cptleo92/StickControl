<script>
  import Vex from 'vexflow';
  import {counter, reps, timer, currentPattern, patterns} from '../store';
  import {patternToStave} from '../patterns/patternToStave';
  import {onMount} from 'svelte';
  import NotationLetters from './NotationLetters.svelte';
  const {Renderer, Stave, Formatter, Beam} = Vex.Flow;

  export const drawNotes = () => {
    const container = document.querySelector('.container');

    // @ts-ignore
    const renderer = new Renderer(container, Renderer.Backends.SVG);

    renderer.resize(575, 100);
    const context = renderer.getContext();

    const staveMeasure1 = new Stave(0, 0, 280);
    staveMeasure1.setContext(context).draw();

    const staveMeasure2 = new Stave(
      // @ts-ignore
      staveMeasure1.width + staveMeasure1.x,
      0,
      280
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

<div class="flex items-center mt-8">
  <p class={`translate-y-2 text-5xl mx-4`}>
    {$currentPattern < 9 ? '0' : ''}{$currentPattern + 1}
  </p>
  <div class="text-center container" />

  <p class={`translate-y-2 text-5xl mx-4 ${$counter === 0 && 'opacity-0'}`}>
    {$reps.selected ? Math.ceil($counter / 16) : $timer.currentSeconds}
  </p>
</div>

<NotationLetters pattern={$patterns[$currentPattern]} />

<script>
  import Vex from 'vexflow';
  import {counter, reps, timer, currentPattern, patterns} from '../store';
  import {patternToStave} from '../patterns/patternToStave';
  import {onMount} from 'svelte';
  import NotationLetters from './NotationLetters.svelte';
  const {Renderer, Stave, Formatter, Beam} = Vex.Flow;

  export const drawNotes = () => {
    const output = document.querySelector('.output-prev');

    // @ts-ignore
    const renderer = new Renderer(output, Renderer.Backends.SVG);

    renderer.resize(540, 100);
    const context = renderer.getContext();

    const staveMeasure1 = new Stave(0, 0, 265);
    staveMeasure1.setContext(context).draw();

    const staveMeasure2 = new Stave(
      // @ts-ignore
      staveMeasure1.width + staveMeasure1.x,
      0,
      265
    );
    staveMeasure2.setContext(context).draw();

    const notes = patternToStave($patterns[$currentPattern + 1]);

    const beams = notes.map(beam => new Beam(beam));

    Formatter.FormatAndDraw(context, staveMeasure1, notes[0].concat(notes[1]));
    Formatter.FormatAndDraw(context, staveMeasure2, notes[2].concat(notes[3]));

    beams.forEach(b => {
      b.setContext(context).draw();
    });
  };

  $: previewClass =
    ($reps.selected && $counter > ($reps.count - 1) * 16) ||
    ($timer.selected && $timer.currentSeconds <= 3)
      ? 'opacity-25'
      : 'opacity-0';

  onMount(() => drawNotes());
</script>

<div
  class={`flex items-center justify-center mt-8 transition-all
  ${previewClass}
`}
>
  <p class={`translate-y-2 text-2xl mr-4`}>
    {$currentPattern < 8 ? '0' : ''}{$currentPattern + 2}
  </p>
  <div class="text-center output-prev relative">
    <NotationLetters pattern={$patterns[$currentPattern + 1]} preview={true} />
  </div>
</div>

<script>
  import Vex from 'vexflow';
  import {counter, reps, currentPattern, patterns} from '../store';
  import {patternToStave} from '../patterns/patternToStave';
  import {onMount} from 'svelte';
  import NotationLetters from './NotationLetters.svelte';
  const {Renderer, Stave, Formatter, Beam} = Vex.Flow;

  export const drawNotes = () => {
    const container = document.querySelector('.container-prev');

    // @ts-ignore
    const renderer = new Renderer(container, Renderer.Backends.SVG);

    renderer.resize(620, 100);
    const context = renderer.getContext();

    const staveMeasure1 = new Stave(0, 0, 300);
    staveMeasure1.setContext(context).draw();

    const staveMeasure2 = new Stave(
      // @ts-ignore
      staveMeasure1.width + staveMeasure1.x,
      0,
      300
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

  $: previewClass = $counter > ($reps - 1) * 16 ? 'opacity-25' : 'opacity-0';

  onMount(() => drawNotes());
</script>

<div
  class={`flex items-center justify-center mt-8 transition-all
  ${previewClass}
`}
>
  <div class="text-center container-prev" />
</div>

<NotationLetters pattern={$patterns[$currentPattern + 1]} preview={true} />

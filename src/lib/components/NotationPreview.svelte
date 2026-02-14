<script>
  import Vex from 'vexflow';
  import {counter, reps, timer, currentPattern, patterns, currentPatternInfo} from '../store';
  import {patternToStave} from '../patterns/patternToStave';
  import {onMount} from 'svelte';
  import NotationLetters from './NotationLetters.svelte';
  const {Renderer, Stave, Formatter, Beam, Tuplet} = Vex.Flow;

  export const drawNotes = () => {
    const output = document.querySelector('.output-prev');
    if (!output) return;

    // Remove previous VexFlow SVG without destroying Svelte children
    output.querySelectorAll(':scope > svg').forEach(el => el.remove());

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

    const measures = patternToStave($patterns[$currentPattern + 1]);

    const beamInstances = [];
    measures.forEach(m => {
      m.beams.forEach(notes => beamInstances.push(new Beam(notes)));
      m.tuplets.forEach(notes => beamInstances.push(new Tuplet(notes)));
    });

    Formatter.FormatAndDraw(context, staveMeasure1, measures[0].allNotes);
    Formatter.FormatAndDraw(context, staveMeasure2, measures[1].allNotes);

    beamInstances.forEach(b => b.setContext(context).draw());

    // Extract rendered x-positions of all notes for letter alignment
    noteXPositions = [
      ...measures[0].allNotes.map(n => n.getAbsoluteX()),
      ...measures[1].allNotes.map(n => n.getAbsoluteX())
    ];
  };

  let noteXPositions = [];
  let mounted = false;

  $: previewClass =
    ($reps.selected && $counter > ($reps.count - 1) * $currentPatternInfo.totalNotes) ||
    ($timer.selected && $timer.currentSeconds <= 3)
      ? 'opacity-25'
      : 'opacity-0';

  onMount(() => { mounted = true; });

  // Reactively redraw when pattern changes
  $: if (mounted && $currentPattern < $patterns.length - 1) {
    $currentPattern;
    drawNotes();
  }
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
    <NotationLetters pattern={$patterns[$currentPattern + 1]} preview={true} {noteXPositions} />
  </div>
</div>

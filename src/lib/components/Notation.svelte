<script>
  import Vex from 'vexflow';
  import {counter, reps, timer, currentPattern, patterns, currentPatternInfo} from '../store';
  import {patternToStave} from '../patterns/patternToStave';
  import {onMount} from 'svelte';
  import NotationLetters from './NotationLetters.svelte';
  const {Renderer, Stave, Formatter, Beam, Tuplet} = Vex.Flow;

  export const drawNotes = () => {
    const output = document.querySelector('.output');
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

    const measures = patternToStave($patterns[$currentPattern]);

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

  onMount(() => { mounted = true; });

  // Reactively redraw when pattern changes
  $: if (mounted) {
    $currentPattern;
    drawNotes();
  }
</script>

<div
  class={`m-auto flex items-center justify-center border-2 rounded-full text-2xl my-2 font-bold h-16 w-16 bg-slate-500 text-white ${
    $counter === 0 && 'opacity-0'
  }`}
>
  {$reps.selected ? Math.ceil($counter / $currentPatternInfo.totalNotes) : $timer.currentSeconds}
</div>
<div class="flex items-center justify-center">
  <p class={`translate-y-2 text-2xl mr-4`}>
    {$currentPattern < 9 ? '0' : ''}{$currentPattern + 1}
  </p>
  <div class="text-center output relative">
    <NotationLetters pattern={$patterns[$currentPattern]} {noteXPositions} />
  </div>
</div>

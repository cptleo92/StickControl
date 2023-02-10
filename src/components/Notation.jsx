import { useEffect, useRef, useContext, useState } from "react";
import { CounterContext, PatternContext } from "../App";
import Vex from "vexflow";
import NotationLetters from "./NotationLetters";
import { patternToStave } from "../patterns/patternToStave";

const { Renderer, Stave, Formatter, Beam } = Vex.Flow;

const Notation = () => {
  const ref = useRef();
  const { counter } = useContext(CounterContext);
  const { pattern } = useContext(PatternContext);

  const [drawing, setDrawing] = useState(true);

  const drawNotes = () => {
    setDrawing(true);
    const svg = document.querySelector("svg");
    if (svg) svg.remove();

    const renderer = new Renderer(ref.current, Renderer.Backends.SVG);

    renderer.resize(620, 100);
    const context = renderer.getContext();

    const staveMeasure1 = new Stave(0, 0, 300);
    staveMeasure1.setContext(context).draw();

    const staveMeasure2 = new Stave(
      staveMeasure1.width + staveMeasure1.x,
      0,
      300
    );
    staveMeasure2.setContext(context).draw();

    const notes = patternToStave(pattern);

    const beams = notes.map((beam) => new Beam(beam));

    Formatter.FormatAndDraw(context, staveMeasure1, notes[0].concat(notes[1]));
    Formatter.FormatAndDraw(context, staveMeasure2, notes[2].concat(notes[3]));

    beams.forEach((b) => {
      b.setContext(context).draw();
    });

    setDrawing(false);
  };

  useEffect(() => {
    drawNotes();
  }, [pattern]);

  return (
    <>
      <div className="flex items-center justify-center">
        <p className={`translate-y-2 text-5xl mx-6`}>1</p>
        <div className="text-center" ref={ref}></div>
        <p
          className={`translate-y-2 text-5xl mx-6 ${
            counter === 0 && "opacity-0"
          }`}
        >
          {Math.ceil(counter / 4)}
        </p>
      </div>
      {!drawing && <NotationLetters />}
    </>
  );
};

export default Notation;

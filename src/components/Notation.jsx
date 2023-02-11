import { useContext, useEffect, useRef, useState } from "react";
import Vex from "vexflow";
import NotationLetters from "./NotationLetters";
import { patternToStave } from "../patterns/patternToStave";
import { CounterContext, REPS } from "../App";

const { Renderer, Stave, Formatter, Beam } = Vex.Flow;

const Notation = ({ preview, pattern, currentPattern, nextPattern }) => {
  const ref = useRef();
  const { counter } = useContext(CounterContext);

  const [drawing, setDrawing] = useState(true);

  const drawNotes = () => {
    setDrawing(true);

    if (ref.current) ref.current.firstChild?.remove();
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

    const notes = patternToStave(preview ? nextPattern : pattern);

    const beams = notes.map((beam) => new Beam(beam));

    Formatter.FormatAndDraw(context, staveMeasure1, notes[0].concat(notes[1]));
    Formatter.FormatAndDraw(context, staveMeasure2, notes[2].concat(notes[3]));

    beams.forEach((b) => {
      b.setContext(context).draw();
    });

    setDrawing(false);
  };

  const getPreviewClass = () => {
    if (preview) {
      if (counter > (REPS - 1) * 16) {
        return "opacity-20";
      } else {
        return "opacity-0";
      }
    }
  };

  useEffect(() => {
    drawNotes();
  }, [pattern]);

  return (
    <>
      <div
        className={`flex items-center justify-center mt-8 transition-all
          ${getPreviewClass()}
        `}
      >
        <p className={`translate-y-2 text-5xl mx-6`}>
          {preview ? currentPattern + 2 : currentPattern + 1}
        </p>
        <div className="text-center container" ref={ref}></div>
        {!preview && (
          <p
            className={`translate-y-2 text-5xl mx-6 ${
              counter === 0 && "opacity-0"
            }`}
          >
            {Math.ceil(counter / 16)}
          </p>
        )}
      </div>

      {!drawing && (
        <NotationLetters
          counter={counter}
          pattern={pattern}
          preview={preview}
        />
      )}
    </>
  );
};

export default Notation;

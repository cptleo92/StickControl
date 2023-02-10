import { useEffect, useRef, useContext } from "react";
import { CounterContext } from "../App";
import Vex from "vexflow";

const { Renderer, Stave, StaveNote, Formatter, Beam } = Vex.Flow;

const Notation = () => {
  const ref = useRef();
  const { counter } = useContext(CounterContext);

  const drawNotes = () => {
    const svg = document.querySelector("svg");
    if (svg) svg.remove();

    const renderer = new Renderer(ref.current, Renderer.Backends.SVG);

    renderer.resize(620, 100);
    const context = renderer.getContext();

    const staveMeasure1 = new Stave(0, 0, 300);
    staveMeasure1.addClef("bass").setContext(context).draw();

    const staveMeasure2 = new Stave(
      staveMeasure1.width + staveMeasure1.x,
      0,
      300
    );
    staveMeasure2.setContext(context).draw();

    const notes1 = [
      new StaveNote({ keys: ["c/5"], duration: "8" }).setStyle({
        fillStyle: "green",
        strokeStyle: "green",
      }),
      new StaveNote({ keys: ["a/4"], duration: "8" }),
      new StaveNote({ keys: ["c/5"], duration: "8" }),
      new StaveNote({ keys: ["a/4"], duration: "8" }),
    ];

    const notes2 = [
      new StaveNote({ keys: ["c/5"], duration: "8" }),
      new StaveNote({ keys: ["a/4"], duration: "8" }),
      new StaveNote({ keys: ["c/5"], duration: "8" }),
      new StaveNote({ keys: ["a/4"], duration: "8" }),
    ];

    const notes3 = [
      new StaveNote({ keys: ["c/5"], duration: "8" }).setStyle({
        fillStyle: "green",
        strokeStyle: "green",
      }),
      new StaveNote({ keys: ["a/4"], duration: "8" }),
      new StaveNote({ keys: ["c/5"], duration: "8" }),
      new StaveNote({ keys: ["a/4"], duration: "8" }),
    ];

    const notes4 = [
      new StaveNote({ keys: ["c/5"], duration: "8" }),
      new StaveNote({ keys: ["a/4"], duration: "8" }),
      new StaveNote({ keys: ["c/5"], duration: "8" }),
      new StaveNote({ keys: ["a/4"], duration: "8" }),
    ];

    const beams = [
      new Beam(notes1),
      new Beam(notes2),
      new Beam(notes3),
      new Beam(notes4),
    ];

    Formatter.FormatAndDraw(context, staveMeasure1, notes1.concat(notes2));
    Formatter.FormatAndDraw(context, staveMeasure2, notes3.concat(notes4));

    beams.forEach((b) => {
      b.setContext(context).draw();
    });
  };

  useEffect(() => {
    drawNotes();
  }, []);

  return (
    <div className="flex items-center justify-center">
      <p
        className={`translate-y-2 text-5xl mx-6 ${
          counter === 0 && "opacity-0"
        }`}
      >
        {Math.ceil(counter / 4)}
      </p>
      <div className="text-center" ref={ref}></div>
    </div>
  );
};

export default Notation;

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

    renderer.resize(415, 415);
    const context = renderer.getContext();

    const stave = new Stave(10, 40, 400);
    stave.addClef("bass");

    stave.setContext(context).draw();

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

    const allNotes = notes1.concat(notes2);

    const beams = [new Beam(notes1), new Beam(notes2)];

    Formatter.FormatAndDraw(context, stave, allNotes);

    beams.forEach((b) => {
      b.setContext(context).draw();
    });
  };

  useEffect(() => {
    drawNotes();
  }, []);

  return (
    <div className="flex">
      <div className="m-auto text-center relative" ref={ref}></div>

      <p
        className={`translate-y-16 text-5xl -translate-x-16 ${
          counter === 0 && "opacity-0"
        }`}
      >
        {Math.ceil(counter / 4)}
      </p>
    </div>
  );
};

export default Notation;

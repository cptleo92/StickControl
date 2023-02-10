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

    renderer.resize(415, 100);
    const context = renderer.getContext();

    const stave = new Stave(0, 0, 400);
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
    <div className="flex items-center justify-center">
      <div className="text-center" ref={ref}></div>

      <p className={`text-5xl mx-6 ${counter === 0 && "opacity-0"}`}>
        {Math.ceil(counter / 4)}
      </p>
    </div>
  );
};

export default Notation;

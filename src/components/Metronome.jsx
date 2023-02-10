import { useState, useEffect, useContext } from "react";
import { CounterContext } from "../App";
import metronomeSFX from "/sfx/metronome.mp3";

const Metronome = ({ bpm, setBpm, playing, setPlaying }) => {
  const [intervalId, setIntervalId] = useState();

  const audio = new Audio(metronomeSFX);
  const { tick, resetCounter } = useContext(CounterContext);

  const togglePlaying = () => {
    if (playing) {
      resetCounter();
      clearInterval(intervalId);
      setPlaying(false);
    } else {
      setIntervalId(
        setInterval(() => {
          audio.currentTime = 0.02;
          audio.play();
          tick();
        }, (60 / bpm) * 1000)
      );

      setPlaying(true);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center my-8">
      <div>
        <input
          type="number"
          className="text-black border-black border"
          value={bpm}
          onChange={(e) => setBpm(e.target.value)}
        />
        BPM
      </div>
      <div>
        <button
          className="bg-slate-300 py-2 px-4 border-black border-2 text-black my-4 rounded-md"
          onClick={togglePlaying}
        >
          {playing ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
};

export default Metronome;

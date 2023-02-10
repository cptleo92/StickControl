import { useState, useEffect, useContext } from "react";
import { CounterContext } from "../App";
import metronomeSFX from "/sfx/metronome.mp3";

const Metronome = ({ bpm, setBpm, playing, setPlaying }) => {
  const [intervalId, setIntervalId] = useState();

  const audio = new Audio(metronomeSFX);
  const { tick, resetCounter } = useContext(CounterContext);

  // purpose of the setTimeouts:
  // 1) synchronizes the sfx with the counter update
  // 2) resets the counter after the final tick

  const togglePlaying = () => {
    if (playing) {
      clearInterval(intervalId);
      setPlaying(false);

      setTimeout(() => {
        resetCounter();
      }, 400);
    } else {
      setIntervalId(
        setInterval(async () => {
          audio.currentTime = 0;

          audio.play().then(() => setTimeout(tick, 400));
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

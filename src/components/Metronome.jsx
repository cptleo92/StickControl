import { useState, useEffect } from "react";
import metronomeSFX from "/sfx/metronome.mp3";

const Metronome = () => {
  const [bpm, setBpm] = useState(60);
  const [playing, setPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState();

  const audio = new Audio(metronomeSFX);

  const togglePlaying = () => {
    if (playing) {
      // audio.pause();
      clearInterval(intervalId);
      setPlaying(false);
    } else {
      setIntervalId(
        setInterval(() => {
          audio.currentTime = 0;
          audio.play();
        }, (60 / bpm) * 1000)
      );

      setPlaying(true);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center">
      <div>
        <input
          type="number"
          className="text-black"
          value={bpm}
          onChange={(e) => setBpm(e.target.value)}
        />
        BPM
      </div>
      <div>
        <button
          className="bg-slate-50 py-2 px-4 border text-black my-4"
          onClick={togglePlaying}
        >
          {playing ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
};

export default Metronome;

import { useState, createContext, useEffect } from "react";
import Metronome from "./components/Metronome";
import Notation from "./components/Notation";
import patterns from "./patterns/patterns";

export const CounterContext = createContext(null);
export const PatternContext = createContext(null);

function App() {
  const [bpm, setBpm] = useState(150);
  const [playing, setPlaying] = useState(false);
  const [counter, setCounter] = useState(0);
  const [currentPattern, setCurrentPattern] = useState(0);
  const [intervalId, setIntervalId] = useState();

  const REPS = 4;

  const updatePattern = () => {
    setCurrentPattern((pattern) => (pattern + 1) % patterns.length);
  };

  const tick = () => {
    setCounter((ct) => {
      if (ct > 0 && ct % (REPS * 8) === 0) {
        updatePattern();
        return 1;
      }
      return ct + 1;
    });
  };

  const resetCounter = () => setCounter(0);

  return (
    <CounterContext.Provider
      value={{
        counter,
        tick,
        resetCounter,
        playing,
        setPlaying,
        intervalId,
        setIntervalId,
        REPS,
      }}
    >
      <PatternContext.Provider
        value={{
          currentPattern,
          pattern: patterns[currentPattern],
          nextPattern: patterns[currentPattern + 1],
          setCurrentPattern,
          updatePattern,
        }}
      >
        <div className="flex flex-col justify-center my-8 max-w-screen-md m-auto">
          <h1 className="text-center text-5xl my-4 underline">Stick Control</h1>
          <h2 className="text-center text-3xl my-1">for the Snare Drummer</h2>
          <h3 className="text-center text-xl my-1">
            <em>... for the Screen</em>
          </h3>
          <Metronome bpm={bpm} setBpm={setBpm} />
          <Notation />
          {currentPattern < patterns.length - 1 && <Notation preview />}
        </div>
      </PatternContext.Provider>
    </CounterContext.Provider>
  );
}

export default App;

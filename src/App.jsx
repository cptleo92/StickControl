import { useState, useEffect, createContext } from "react";
import Metronome from "./components/Metronome";
import Notation from "./components/Notation";
import allPatterns from "./patterns/patterns";

export const REPS = 4;
export const CounterContext = createContext();

function App() {
  const [bpm, setBpm] = useState(150);
  const [playing, setPlaying] = useState(false);
  const [counter, setCounter] = useState(0);
  const [patterns, setPatterns] = useState();
  const [currentPattern, setCurrentPattern] = useState(0);
  const [loading, setLoading] = useState(true);

  const updatePattern = () => {
    setCurrentPattern((pattern) => (pattern + 1) % patterns.length);
  };

  const tick = () => {
    setCounter((ct) => {
      if (ct > 0 && ct % (REPS * 16) === 0) {
        updatePattern();
        return 1;
      }
      return ct + 1;
    });
  };

  useEffect(() => {
    async function loadPatterns() {
      setPatterns(allPatterns);
    }

    loadPatterns().then(() => setLoading(false));
  }, []);

  if (loading) return;

  return (
    <CounterContext.Provider value={{ counter }}>
      <div className="flex flex-col justify-center my-8 max-w-screen-md m-auto">
        <h1 className="text-center text-5xl my-4 underline">Stick Control</h1>
        <h2 className="text-center text-3xl my-1">for the Snare Drummer</h2>
        <h3 className="text-center text-xl my-1">
          <em>... for the Screen</em>
        </h3>
        <Metronome
          setCounter={setCounter}
          counter={counter}
          bpm={bpm}
          setBpm={setBpm}
          tick={tick}
          playing={playing}
          setPlaying={setPlaying}
        />

        <Notation
          counter={counter}
          pattern={patterns[currentPattern]}
          nextPattern={patterns[currentPattern + 1]}
          currentPattern={currentPattern}
        />
        {currentPattern < patterns.length - 1 && (
          <Notation
            counter={counter}
            pattern={patterns[currentPattern]}
            nextPattern={patterns[currentPattern + 1]}
            currentPattern={currentPattern}
            preview
          />
        )}
      </div>
    </CounterContext.Provider>
  );
}

export default App;

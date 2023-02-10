import { useState, useContext, createContext } from "react";
import Metronome from "./components/Metronome";
import Notation from "./components/Notation";

export const CounterContext = createContext(null);

function App() {
  const [bpm, setBpm] = useState(60);
  const [playing, setPlaying] = useState(false);

  const [counter, setCounter] = useState(0);

  const tick = () => setCounter((ct) => ct + 1);

  const resetCounter = () => setCounter(0);

  return (
    <CounterContext.Provider value={{ counter, tick, resetCounter }}>
      <div className="flex flex-col justify-center my-8 max-w-screen-md m-auto">
        <h1 className="text-center text-5xl my-4 underline">Stick Control</h1>
        <h2 className="text-center text-3xl my-1">for the Snare Drummer</h2>
        <h3 className="text-center text-xl my-1">
          <em>... for the Screen</em>
        </h3>
        <Metronome
          bpm={bpm}
          setBpm={setBpm}
          playing={playing}
          setPlaying={setPlaying}
        />
        <Notation />
      </div>
    </CounterContext.Provider>
  );
}

export default App;

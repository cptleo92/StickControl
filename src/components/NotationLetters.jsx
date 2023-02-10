import { useContext } from "react";
import { CounterContext, PatternContext } from "../App";

const NotationLetters = ({ preview }) => {
  // "rlrl rlrl rlrl rlrl",
  const { pattern } = useContext(PatternContext);
  const { counter, REPS } = useContext(CounterContext);

  // [["R", "L", "R", "L", "R", "L", "R", "L"], ["R", "L", "R", "L", "R", "L", "R", "L"]
  // const letters = [[], []];

  // let preLetters = pattern.split(" ").map((group) => group.toUpperCase()); // ["RLRL", "RLRL", "RLRL", "RLRL"]

  // letters[0].push(...preLetters[0].split(""));
  // letters[0].push(...preLetters[1].split(""));
  // letters[1].push(...preLetters[2].split(""));
  // letters[1].push(...preLetters[3].split(""));

  // for (let i = 0; i < notes.length; i++) {
  //   const note = notes[i];

  //   const letter = document.createElement("div");
  //   letter.textContent = letters[i];
  //   letter.classList.add("relative", "text-3xl", "left-0", "top-0");

  //   note.classList.add("absolute");
  //   note.appendChild(letter);
  // }

  const letters = [];
  for (let char of pattern) {
    if (char !== " ") letters.push(char.toUpperCase());
  }

  // const notes = document.querySelectorAll(".vf-notehead");
  // const positions = [];
  // notes.forEach((note) =>
  //   positions.push(Math.trunc(note.getBoundingClientRect().left))
  // );

  // const spacings = [];

  // for (let i = 1; i < positions.length; i++) {
  //   spacings.push(`mr-[${positions[i] - positions[i - 1]}px]`);
  // }

  // spacings.push(0);

  const getPreviewClass = () => {
    if (preview) {
      if (counter > (REPS - 1) * 8) {
        return "opacity-20";
      } else {
        return "opacity-0";
      }
    }
  };

  return (
    <div
      className={`flex translate-x-[90px] ${getPreviewClass()} transition-all`}
    >
      {letters.slice(0, 8).map((letter, idx) => (
        <div key={idx} className="mr-[27px]">
          {letter}
        </div>
      ))}
      <div className="flex ml-3">
        {letters.slice(8).map((letter, idx) => (
          <div key={idx} className="mr-[27px]">
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotationLetters;

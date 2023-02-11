import { REPS } from "../App";

const NotationLetters = ({ counter, pattern, preview }) => {
  const letters = [];
  for (let char of pattern) {
    if (char !== " ") letters.push(char.toUpperCase());
  }

  const getPreviewClass = () => {
    if (preview) {
      if (counter > (REPS - 1) * 16) {
        return "opacity-20";
      } else {
        return "opacity-0";
      }
    }
  };

  const letterClass = (idx) => {
    return `mr-[27px] ${
      idx === (counter - 1) % 16 && "text-emerald-800 font-bold"
    }`;
  };

  return (
    <div
      className={`flex translate-x-[90px]  ${getPreviewClass()} transition-all`}
    >
      {letters.slice(0, 8).map((letter, idx) => (
        <div key={idx} className={letterClass(idx)}>
          {letter}
        </div>
      ))}
      <div className="flex ml-3">
        {letters.slice(8).map((letter, idx) => (
          <div key={idx + 8} className={letterClass(idx + 8)}>
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotationLetters;

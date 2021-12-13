import { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setHistory((prev) => {
      const newHistory = [...prev];
      if (replace) {
        newHistory.pop();
      }
      return [...newHistory, newMode];
    });
  };

  const back = () => {
    const newHistory = [...history];
    newHistory.pop();
    setHistory(newHistory);
  };

  const mode = history[history.length - 1];

  return { mode, transition, back };
}

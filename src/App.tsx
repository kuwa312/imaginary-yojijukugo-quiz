import { useState, useEffect } from "react";
import { quizzes } from "./data";
import type { Quiz } from "./data";
import { QuizDisplay } from "./components/QuizDisplay";
import { ResultDisplay } from "./components/ResultDisplay";
import "./index.css";

function App() {
  const [current, setCurrent] = useState<Quiz | null>(null);
  const [masked, setMasked] = useState("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    pickRandom();
  }, []);

  const pickRandom = () => {
    const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
    setCurrent(quiz);

    // ランダムで1文字を○に置き換え
    const idx = Math.floor(Math.random() * quiz.word.length);
    const maskedWord = quiz.word.slice(0, idx) + "○" + quiz.word.slice(idx + 1);
    setMasked(maskedWord);

    setInput("");
    setResult("");
  };

  const checkAnswer = () => {
    if (!current) return;
    if (input === current.word) {
      setResult("正解🎉");
    } else {
      setResult(`不正解… 正解は ${current.word}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-3xl font-bold underline">四字熟語クイズ</h1>
      <p>四字熟語の意味を見て、○の部分を当ててみよう！</p>

      {current && (
        <>
          <QuizDisplay
            meaning={current.meaning}
            maskedWord={masked}
            input={input}
            onInputChange={setInput}
            onCheck={checkAnswer}
            onNext={pickRandom}
          />
          <ResultDisplay result={result} />
        </>
      )}
    </div>
  );
}

export default App;

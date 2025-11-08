import { useState, useEffect } from "react";
import { quizzes } from "./data";
import type { Quiz } from "./data";
import { QuizDisplay } from "./components/QuizDisplay";
import { ResultDisplay } from "./components/ResultDisplay";

// 👈 【追加】クイズの合計問題数を定義
const TOTAL_QUESTIONS = 10;

function App() {
  const [current, setCurrent] = useState<Quiz | null>(null);
  const [masked, setMasked] = useState("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  
  // 👈 【追加】スコアと終了状態
  const [score, setScore] = useState(0); 
  const [totalAnswered, setTotalAnswered] = useState(0); 
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    pickRandom();
  }, []);

  // 👈 【追加】クイズの再スタート処理
  const handleRestart = () => {
    setScore(0);
    setTotalAnswered(0);
    setIsFinished(false);
    pickRandom();
  };

  const pickRandom = () => {
    // 👈 【変更】全問解答済みかチェック
    if (totalAnswered >= TOTAL_QUESTIONS) {
        setIsFinished(true); // 終了フラグを立てて処理を中断
        return;
    }

    const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
    setCurrent(quiz);

    // ランダムで1文字を○に置き換え
    const idx = Math.floor(Math.random() * quiz.word.length);
    const maskedWord = quiz.word.slice(0, idx) + "○" + quiz.word.slice(idx + 1);
    setMasked(maskedWord);

    setInput("");
    setResult("");
    
    // 👈 【追加】解答済みの問題数をインクリメント
    setTotalAnswered(prev => prev + 1);
  };

  const checkAnswer = () => {
    if (!current) return;
    
    if (input === current.word) {
      setResult("正解🎉");
      // 👈 【変更】正解の場合、スコアをインクリメント
      setScore(prev => prev + 1);
    } else {
      setResult(`不正解… 正解は ${current.word}`);
    }
  };

  // 👈 【変更】表示内容を isFinished の状態に応じて切り替える
  const renderContent = () => {
    if (isFinished) {
      // クイズ終了後の画面
      return (
        <ResultDisplay 
          score={score}
          totalQuestions={TOTAL_QUESTIONS}
          message={score === TOTAL_QUESTIONS ? "パーフェクト！素晴らしい成績です！" : "お疲れ様でした！次こそ全問正解を目指そう！"}
          onRestart={handleRestart} // リスタート処理を ResultDisplay に渡す
        />
      );
    }
    
    // クイズ進行中の画面
    return current && (
        <>
          <QuizDisplay
            meaning={current.meaning}
            maskedWord={masked}
            input={input}
            onInputChange={setInput}
            onCheck={checkAnswer}
            onNext={pickRandom}
          />
          {/* 現在何問目かを表示 */}
          <p>第 {totalAnswered} 問 / 全 {TOTAL_QUESTIONS} 問中</p> 
          {result && <p style={{ color: result.includes('正解') ? 'green' : 'red' }}>{result}</p>}
        </>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>四字熟語クイズ</h1>
      <p>四字熟語の意味を見て、○の部分を当ててみよう！</p>

      {renderContent()} {/* 👈 変更した関数を呼び出す */}

    </div>
  );
}

export default App;
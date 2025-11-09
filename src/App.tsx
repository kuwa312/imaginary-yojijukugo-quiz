import { useState, useEffect } from "react";
import { quizzes } from "./data";
import type { Quiz } from "./data";
import { QuizDisplay } from "./components/QuizDisplay";
import { ResultDisplay } from "./components/ResultDisplay";
import './App.css'; // 【重要】CSSをインポート

const TOTAL_QUESTIONS = 10;
const PLAYER_NAMES = ["プレイヤー1", "プレイヤー2"];

// プレイヤーデータ構造 (変更なし)
interface PlayerResult {
  name: string;
  score: number;
  answers: {
    questionIndex: number;
    correctWord: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

// ゲームの状態管理 (変更なし)
interface GameFlowState {
    currentQuestionIndex: number; // 0から9
    currentPlayerIndex: number;   // 0または1
    isFinished: boolean;
    showResultButton: boolean;
}

function App() {
  const [current, setCurrent] = useState<Quiz | null>(null);
  const [masked, setMasked] = useState("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  
  const [playerResults, setPlayerResults] = useState<PlayerResult[]>(
      PLAYER_NAMES.map(name => ({ name, score: 0, answers: [] }))
  );
  
  const [flowState, setFlowState] = useState<GameFlowState>({
      currentQuestionIndex: 0,
      currentPlayerIndex: 0,
      isFinished: false,
      showResultButton: false,
  });
  
  const { currentQuestionIndex, currentPlayerIndex, isFinished, showResultButton } = flowState;

  useEffect(() => {
    // インデックスが変わるたびに新しい問題を取得
    getNewQuiz(); 
  }, [currentQuestionIndex]);

  const handleRestart = () => {
    setPlayerResults(
        PLAYER_NAMES.map(name => ({ name, score: 0, answers: [] }))
    );
    setFlowState({
        currentQuestionIndex: 0,
        currentPlayerIndex: 0,
        isFinished: false,
        showResultButton: false,
    });
    getNewQuiz(); 
  };

  const getNewQuiz = () => {
    const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
    setCurrent(quiz);

    const idx = Math.floor(Math.random() * quiz.word.length);
    const maskedWord = quiz.word.slice(0, idx) + "○" + quiz.word.slice(idx + 1);
    setMasked(maskedWord);

    setInput("");
    setResult("");
  }

  const pickRandom = () => {
    setFlowState(prev => ({ 
        ...prev, 
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showResultButton: false,
    }));
  };

  const checkAnswer = () => {
    if (!current) return;
    
    const isCorrect = input === current.word;
    
    // 1. 回答履歴とスコアの更新
    setPlayerResults(prevResults => {
        const newResults = [...prevResults];
        const player = newResults[currentPlayerIndex];

        if (isCorrect) {
            player.score += 1;
        }

        player.answers.push({
            questionIndex: currentQuestionIndex + 1,
            correctWord: current.word,
            userAnswer: input,
            isCorrect: isCorrect,
        });
        return newResults;
    });
    
    // 2. 結果メッセージの表示
    if (isCorrect) {
      setResult("正解🎉");
    } else {
      setResult(`不正解… 正解は ${current.word}`);
    }

    // 3. 最終問題・最終プレイヤーの判定
    const isLastQuestion = currentQuestionIndex === TOTAL_QUESTIONS - 1;
    const isLastPlayer = currentPlayerIndex === PLAYER_NAMES.length - 1;
    
    if (isLastQuestion) {
        setTimeout(() => {
            if (isLastPlayer) {
                setFlowState(prev => ({ ...prev, showResultButton: true }));
            } else {
                setFlowState(prev => ({ ...prev, showResultButton: true }));
            }
        }, 1500); 
    } 
  };
  
  const goToResult = () => {
      setFlowState(prev => ({ ...prev, isFinished: true }));
  };
  
  const handleNextPlayerOrQuestion = () => {
    const isLastQuestion = currentQuestionIndex === TOTAL_QUESTIONS - 1;
    const isLastPlayer = currentPlayerIndex === PLAYER_NAMES.length - 1;

    if (isLastQuestion && !isLastPlayer) {
        // 最終問題終了後、次のプレイヤーへ進む
        setFlowState(prev => ({ 
            ...prev, 
            currentQuestionIndex: 0, // 問題インデックスをリセット
            currentPlayerIndex: prev.currentPlayerIndex + 1, // プレイヤーを切り替え
            showResultButton: false,
        }));
        getNewQuiz(); // 次の問題(1問目)をロード
    }
  };


  const renderContent = () => {
    if (isFinished) {
      return (
        <ResultDisplay 
          finalResults={playerResults}
          totalQuestions={TOTAL_QUESTIONS}
          onRestart={handleRestart}
        />
      );
    }
    
    const currentPlayerName = PLAYER_NAMES[currentPlayerIndex];
    
    return current && (
        <>
          <h2 className="player-turn">
             {currentPlayerName} さんのターン
          </h2>
          
          {/* 問題数表示 */}
          <div className="question-status">
             <p>問題 {currentQuestionIndex + 1} / {TOTAL_QUESTIONS}</p>
          </div>

          <QuizDisplay
            // key={currentQuestionIndex + currentPlayerIndex * TOTAL_QUESTIONS} を使用し、問題が変わるたびにコンポーネントを強制的にリセット
            key={currentQuestionIndex + currentPlayerIndex * TOTAL_QUESTIONS} 
            meaning={current.meaning}
            maskedWord={masked}
            input={input}
            onInputChange={setInput}
            onCheck={checkAnswer}
            onNext={pickRandom} 
            // 10問目になるか、リザルトボタンが表示されていなければ「次の問題」ボタンを表示
            showNextButton={currentQuestionIndex < TOTAL_QUESTIONS - 1 && !showResultButton} 
          />
          
          {result && (
              <p className={`result-message ${result.includes('正解') ? 'result-correct' : 'result-incorrect'}`}>
                  {result}
              </p>
          )}
          
          {showResultButton && (
              <button 
                  onClick={currentPlayerIndex === PLAYER_NAMES.length - 1 ? goToResult : handleNextPlayerOrQuestion} 
                  className={`flow-button ${currentPlayerIndex === PLAYER_NAMES.length - 1 ? 'final-result' : 'next-player'}`}
              >
                  {currentPlayerIndex === PLAYER_NAMES.length - 1 ? "解答結果へ ▶" : `${PLAYER_NAMES[currentPlayerIndex + 1]}へ交代 ▶`}
              </button>
          )}
        </>
    );
  };

  return (
    // 【CSSクラス適用】
    <div className="app-container">
      <div className="quiz-card">
        <h1 className="quiz-title">
            四字熟語対戦クイズ
        </h1>
        <p className="quiz-subtitle">
            四字熟語の意味を見て、○の部分を当ててみよう！
        </p>

        {renderContent()}
      </div>
    </div>
  );
}

export default App;
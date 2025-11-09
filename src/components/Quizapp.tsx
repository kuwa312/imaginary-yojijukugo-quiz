import React, { useState, useEffect } from "react";
import { QuizDisplay } from "./QuizDisplay"; 
import { ResultDisplay } from "./ResultDisplay"; 
import { quizzes } from "../data"; // 正しいパス
import type { Quiz } from "../data";

// App.tsxと同じデータ構造を定義
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
interface GameFlowState {
    currentQuestionIndex: number; 
    currentPlayerIndex: number;  
    isFinished: boolean;
    showResultButton: boolean;
}

interface QuizAppProps {
    roomCode: string;
    isRoomCreator: boolean;
    onEndGame: () => void; // App.tsxに戻るための関数
}

const TOTAL_QUESTIONS = 10;
const PLAYER_NAMES = ["プレイヤー1", "プレイヤー2"];

export const QuizApp: React.FC<QuizAppProps> = ({ roomCode, isRoomCreator, onEndGame }) => {
    // === 状態管理 ===
    const [current, setCurrent] = useState<Quiz | null>(null);
    const [masked, setMasked] = useState("");
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [showCorrectBanner, setShowCorrectBanner] = useState(false); 

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

    // === 問題カウント修正ロジック ===
    useEffect(() => {
        // 問題インデックスが変わるたびに新しい問題を取得
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
        setShowCorrectBanner(false);
        // useEffectが問題をロードする
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
        setShowCorrectBanner(false); 
        
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
            setShowCorrectBanner(true); 
        } else {
            setResult(`不正解… 正解は ${current.word}`);
            setShowCorrectBanner(false);
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
        }
        setShowCorrectBanner(false);
    };

    // === レンダリングロジック ===
    const renderContent = () => {
        if (isFinished) {
            return (
                // リザルト画面
                <ResultDisplay 
                    finalResults={playerResults}
                    totalQuestions={TOTAL_QUESTIONS}
                    onRestart={handleRestart}
                />
            );
        }
        
        const currentPlayerName = PLAYER_NAMES[currentPlayerIndex];
        const isCurrentCorrect = result.includes('正解');

        return current && (
            <>
                {/* ルームコード表示 (QuizApp独自の要素) */}
                <p style={{ textAlign: 'center', color: '#ff5722', fontWeight: 'bold' }}>
                    ルームコード: {roomCode} ({isRoomCreator ? 'ホスト' : '参加者'})
                </p>

                {/* 正解バナーの表示 */}
                {showCorrectBanner && (
                    <div className="skew_banner">
                        <p style={{ marginTop: '50px', fontSize: '30px', fontWeight: 'bold', color: '#333' }}>
                            正解！おめでとう！
                        </p>
                    </div>
                )}
            
                <h2 className="player-turn">
                    {currentPlayerName} さんのターン
                </h2>
                
                <div className="question-status">
                    <p>問題 {currentQuestionIndex + 1} / {TOTAL_QUESTIONS}</p>
                </div>

                <QuizDisplay
                    key={currentQuestionIndex + currentPlayerIndex * TOTAL_QUESTIONS} 
                    meaning={current.meaning}
                    maskedWord={masked}
                    input={input}
                    onInputChange={setInput}
                    onCheck={checkAnswer}
                    onNext={pickRandom} 
                    showNextButton={currentQuestionIndex < TOTAL_QUESTIONS - 1 && !showResultButton} 
                />
                
                {result && (
                    <p className={`result-message ${isCurrentCorrect ? 'result-correct' : 'result-incorrect'}`}>
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
        <>{renderContent()}</> // Fragmentでラップして、外側のApp.tsxのdivにコンテンツを渡す
    );
};
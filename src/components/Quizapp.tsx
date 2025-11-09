import React, { useState, useEffect } from "react";
// QuizDisplayとResultDisplayのインポートは必要に応じて調整してください
import { QuizDisplay } from "./QuizDisplay"; 
import { ResultDisplay } from "./ResultDisplay"; 
// dataのインポートは必要に応じて調整してください
import { quizzes } from "../data"; 
import type { Quiz } from "../data";

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
    currentQuestionIndex: number; // 0から9
    currentPlayerIndex: number;   // 0または1
    isFinished: boolean;
    showResultButton: boolean;
}

interface QuizAppProps {
    roomCode: string;
    isRoomCreator: boolean;
    onEndGame: () => void;
}

const TOTAL_QUESTIONS = 10;
const PLAYER_NAMES = ["プレイヤー1", "プレイヤー2"]; // 簡略化のため固定

export const QuizApp: React.FC<QuizAppProps> = ({ roomCode, isRoomCreator, onEndGame }) => {
    // ... 既存の状態管理 ...
    const [current, setCurrent] = useState<Quiz | null>(null);
    const [masked, setMasked] = useState("");
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [showCorrectBanner, setShowCorrectBanner] = useState(false); 
    
    // 【修正】現在の問題のインデックスを流用
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
    
    const [playerResults, setPlayerResults] = useState<PlayerResult[]>(
        PLAYER_NAMES.map(name => ({ name, score: 0, answers: [] }))
    );
    
    const [flowState, setFlowState] = useState<GameFlowState>({
        currentQuestionIndex: 0,
        currentPlayerIndex: 0,
        isFinished: false,
        showResultButton: false,
    });
    
    const { currentPlayerIndex, isFinished, showResultButton } = flowState;

    // 【修正】問題カウントの useEffect
    useEffect(() => {
        // currentQuestionIndexの変更を検知して新しい問題を取得
        getNewQuiz(); 
    }, [flowState.currentQuestionIndex]); // flowStateのインデックスを監視

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
        // 問題インデックスが変わるので、useEffectがgetNewQuizを呼ぶ
    };
    
    // ... (getNewQuiz, checkAnswer, pickRandom, goToResult, handleNextPlayerOrQuestion のロジックは、以前の App.tsx の最終コードからコピーしてください) ...
    // ... (今回はファイル分離がメインなので、ロジック自体は前の回答のものを利用してください) ...
    
    // 【問題カウント表示のキー】
    const currentQuestionNumber = flowState.currentQuestionIndex + 1;
    
    // ... (renderContent のロジックも前の回答からコピーし、App.cssのクラス名を維持してください) ...
    
    return (
        // ... (App.cssのクラス名を持つコンテナを使用) ...
        <div className="quiz-card">
            <p style={{ textAlign: 'center', color: '#ff5722', fontWeight: 'bold' }}>ルームコード: {roomCode} ({isRoomCreator ? 'ホスト' : '参加者'})</p>
            {/* ... (renderContent の呼び出し) ... */}
        </div>
    );
};
import React, { useState } from "react";
import { QuizApp } from "./components/Quizapp";
import { RoomSetup } from "./components/RoomSetup";
import './App.css'; 

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [isRoomCreator, setIsRoomCreator] = useState(false);

  const handleStartGame = (code: string, isCreator: boolean) => {
    if (code) {
      setRoomCode(code);
      setIsRoomCreator(isCreator);
      setGameStarted(true);
      // 【注意】実際にはここでサーバーにコードを送信する処理が入ります
      console.log(`Game started in room: ${code}, as creator: ${isCreator}`);
    } else {
      alert("ルームコードが必要です。");
    }
  };

  const handleEndGame = () => {
    // リザルト画面から「もう一度対戦する」が押されたときなど
    setGameStarted(false);
    setRoomCode('');
    setIsRoomCreator(false);
  };

  return (
    <div className="app-container">
      <div className="quiz-card">
        <h1 className="quiz-title">
            四字熟語対戦クイズ
        </h1>
        <p className="quiz-subtitle">
            四字熟語の意味を見て、○の部分を当ててみよう！
        </p>

        {gameStarted ? (
          <QuizApp 
            roomCode={roomCode}
            isRoomCreator={isRoomCreator}
            onEndGame={handleEndGame}
          />
        ) : (
          <RoomSetup onStartGame={handleStartGame} />
        )}
      </div>
    </div>
  );
}

export default App;
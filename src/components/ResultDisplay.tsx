import React from 'react';
import './ResultDisplay.css'; 

interface ResultDisplayProps {
  score: number;
  totalQuestions: number;
  message: string;
  onRestart: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  score,
  totalQuestions,
  message,
  onRestart,
}) => {
  const percentage = (score / totalQuestions) * 100;
  
  return (
    // 👈 classNameに置き換え
    <div className="result-container">
      {/* 🎊 ヘッダー */}
      {/* 👈 classNameに置き換え */}
      <h1 className="result-header">
        ✨ クイズ結果発表 ✨
      </h1>
      
      <p className="message">
        {message}
      </p>

      {/* 🏆 スコアの強調表示エリア */}
      {/* 👈 classNameに置き換え */}
      <div className="score-box">
        <p className="score-label">正解数</p>
        {/* 👈 classNameに置き換え */}
        <p className="score-value">
          {score}
        </p>
        <p className="percentage">
          ({totalQuestions}問中) / 正解率: {percentage.toFixed(0)}%
        </p>
      </div>

      {/* ↩️ 再挑戦ボタン */}
      {/* 👈 classNameに置き換え */}
      <button 
        onClick={onRestart}
        className="restart-button"
      >
        💪 もう一度挑戦する
      </button>
    </div>
  );
};
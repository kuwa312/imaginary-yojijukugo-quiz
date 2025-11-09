import React, { useState } from "react";

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

interface ResultDisplayProps {
  finalResults: PlayerResult[];
  totalQuestions: number;
  onRestart: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ finalResults, totalQuestions, onRestart }) => {
  
  // 【修正なし】詳細表示用の状態
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerResult | null>(null);

  // スコア順にソート
  const sortedResults = [...finalResults].sort((a, b) => b.score - a.score);

  // 【修正なし】詳細を閉じる関数
  const closeDetail = () => setSelectedPlayer(null);

  // ------------------------------------------------------------------
  // プレイヤー詳細ビュー
  // ------------------------------------------------------------------
  if (selectedPlayer) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2 style={{ color: '#3F51B5' }}>{selectedPlayer.name} の回答詳細</h2>
        <p><strong>スコア:</strong> {selectedPlayer.score} / {totalQuestions}</p>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>#</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>あなたの回答</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>正解</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>結果</th>
            </tr>
          </thead>
          <tbody>
            {selectedPlayer.answers.map((answer, index) => (
              <tr key={index} style={{ backgroundColor: answer.isCorrect ? '#e8f5e9' : '#ffebee' }}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{answer.questionIndex}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{answer.userAnswer}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{answer.correctWord}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                  {answer.isCorrect ? '⭕️' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 【再確認】closeDetail関数が呼び出されていることを確認 */}
        <button 
          onClick={closeDetail} 
          style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#607D8B', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          成績一覧に戻る
        </button>
      </div>
    );
  }

  // ------------------------------------------------------------------
// 成績一覧ビュー
  // ------------------------------------------------------------------
  return (
    <div className="result-container"> {/* クラス名に置き換え */}
      <h1 className="result-header">🏆 最終結果 🏆</h1> {/* クラス名に置き換え */}
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        全プレイヤーの成績です。
      </p>

      <table className="score-table"> {/* クラス名に置き換え */}
        <thead>
          {/* ... (テーブルヘッダー省略) ... */}
        </thead>
        <tbody>
          {sortedResults.map((player, index) => (
            <tr 
              key={player.name} 
              // 【強調】1位の行にクラス名を追加
              className={index === 0 ? "rank-1" : ""}
            >
              <td style={{ fontWeight: 'bold' }}>
                {index === 0 ? '👑 1位' : `${index + 1}位`}
              </td>
              <td >{player.name}</td>
              <td style={{ fontWeight: 'bold' }}>{player.score} / {totalQuestions}</td>
              <td >
                <button 
                  onClick={() => setSelectedPlayer(player)}
                  className="detail-button" // クラス名に置き換え
                >
                  詳細
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button 
        onClick={onRestart}
        style={{ marginTop: '30px', padding: '15px 30px', fontSize: '20px', backgroundColor: '#3F51B5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        💪 もう一度対戦する
      </button>
    </div>
  );
};
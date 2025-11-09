import React, { useState } from 'react';

interface RoomSetupProps {
  onStartGame: (roomCode: string, isCreator: boolean) => void;
}

export const RoomSetup: React.FC<RoomSetupProps> = ({ onStartGame }) => {
  const [roomCode, setRoomCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const generateRoomCode = () => {
    // ランダムなコードを生成（例: 6桁の数字）
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    onStartGame(code, true); // 作成者としてゲーム開始
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ color: '#3F51B5' }}>🌐 ルームの作成 / 参加</h2>
      <hr style={{ margin: '20px 0' }} />

      {/* ルーム作成 */}
      <button 
        onClick={generateRoomCode}
        className="flow-button next-player"
        style={{ marginBottom: '20px' }}
      >
        ルームを作成 (ホスト)
      </button>

      <p style={{ color: '#999' }}>--- または ---</p>

      {/* ルーム参加 */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="ルームコードを入力"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          style={{ padding: '10px', width: '100%', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          onClick={() => onStartGame(roomCode, false)} // 参加者としてゲーム開始
          disabled={roomCode.length !== 6} // 6桁限定と仮定
          className="flow-button final-result"
        >
          ルームに参加
        </button>
      </div>
      
      {generatedCode && (
        <p style={{ marginTop: '30px', fontWeight: 'bold', color: '#009688' }}>
          発行されたコード: {generatedCode}
        </p>
      )}
    </div>
  );
};
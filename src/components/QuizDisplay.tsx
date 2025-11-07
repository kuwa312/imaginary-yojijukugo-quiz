import React from "react";

interface QuizDisplayProps {
  meaning: string;
  maskedWord: string;
  input: string;
  onInputChange: (value: string) => void;
  onCheck: () => void;
  onNext: () => void;
}

export const QuizDisplay: React.FC<QuizDisplayProps> = ({
  meaning, maskedWord, input, onInputChange, onCheck, onNext
}) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <p><strong>意味：</strong>{meaning}</p>
      <p><strong>問題：</strong>{maskedWord}</p>
      <input value={input} onChange={e => onInputChange(e.target.value)} placeholder="四字熟語を入力" />
      <button onClick={onCheck} style={{ marginLeft: 5 }}>判定</button>
      <button onClick={onNext} style={{ marginLeft: 5 }}>次の問題</button>
    </div>
  );
};

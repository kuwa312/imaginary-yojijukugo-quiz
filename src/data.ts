// src/data.ts
export interface Quiz {
  word: string;
  meaning: string;
}

export const quizzes: Quiz[] = [
  { word: "臥薪嘗胆", meaning: "目的達成のために苦労を耐えること" },
  { word: "以心伝心", meaning: "言葉にせずとも心で通じ合うこと" },
  { word: "温故知新", meaning: "昔のことを学び、新しいことを知ること" },
  { word: "異口同音", meaning: "皆が同じ意見を言うこと" },
];

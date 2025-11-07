#  架空四字熟語クイズ

## 概要
このアプリは、架空の四字熟語の穴埋めクイズを楽しめるWebアプリです。  
**React + TypeScript + Vite** で開発しています。

---

##  デプロイURL
 **https://imaginary-yojijukugo-quiz.web.app/**  

---

## 技術構成（現時点）

| 項目 | 使用技術 |
|------|-----------|
| フロントエンド | React + TypeScript + Vite |
| 状態管理 | React Hooks（useState / useEffect） |
| データ管理 | ローカルJSONデータ（今はまだFirestoreを使っていません） |
| デプロイ | firebase|


### 構成

App.tsx：全体の状態管理（現在の問題、回答、結果など）

components/QuizDisplay.tsx：クイズ画面部分

components/ResultDisplay.tsx：判定結果表示部分

data.ts：四字熟語と意味のローカルデータ定義


---

##  機能一覧
- 四字熟語クイズの出題と解答判定  
- 正解・不正解のフィードバック表示  
- 「次の問題へ」ボタンで進行  
- 現在のスコア表示  

---

##  現在の開発状況
- クイズデータの型定義 (`Quiz` インターフェース)
- クイズロジック（問題の表示・正誤判定）
- Firestoreとの連携は今後実装予定

---

##  セットアップ手順

```bash
# リポジトリをクローン
git clone https://github.com/your-username/imaginary-yojijukugo-quiz.git
cd imaginary-yojijukugo-quiz

# 依存関係をインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで [http://localhost:5173](http://localhost:5173) にアクセス。

---

##  今後の予定

- Firestoreとの接続によるデータ管理
- 問題データの追加・編集
- UI改善
- スコア機能
などなど
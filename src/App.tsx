import { useState, useEffect } from "react";
import "./index.css";
import { io } from "socket.io-client";

// 例: http://localhost:3001
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3001";

// 時間設定
const QUESTION_TIME_LIMIT = 20; // 1問あたりの制限時間（秒）
const WARNING_TIME_THRESHOLD = 10; // この秒数以下で警告色に変わる

const socket = io(SOCKET_URL);

interface Player {
  id: string;
  name: string;
  score: number;
}

interface Room {
  code: string;
  host: string;
  players: Player[];
  gameState: "lobby" | "playing" | "finished";
  currentQuestion: number;
}

interface Question {
  word: string;
  meaning: string;
  blank: number;
  answer: string;
}

function App() {
  const [screen, setScreen] = useState<string>("home"); // home, lobby, game, result
  const [roomCode, setRoomCode] = useState<string>("");
  const [inputRoomCode, setInputRoomCode] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [room, setRoom] = useState<Room | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(12);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [answer, setAnswer] = useState<string>("");
  const [isHost, setIsHost] = useState(false);
  const [finalScores, setFinalScores] = useState<
    Array<{ name: string; score: number }>
  >([]);
  const [myScore, setMyScore] = useState(0);
  const [answerResult, setAnswerResult] = useState<{
    correct: boolean;
    points: number;
    correctAnswer?: string;
  } | null>(null);

  // Socket.IOイベントリスナー
  useEffect(() => {
    socket.on("connect", () => {
      console.log("サーバーに接続しました");
    });

    socket.on("connect_error", (err) => {
      console.error("接続エラー:", err);
    });

    // ルーム作成完了
    socket.on("room-created", (data: { roomCode: string; room: Room }) => {
      setRoomCode(data.roomCode);
      setRoom(data.room);
      setScreen("lobby");
    });

    // プレイヤー参加
    socket.on("player-joined", (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    // プレイヤー退出
    socket.on("player-left", (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    // ゲーム開始
    socket.on(
      "game-started",
      (data: {
        question: Question;
        questionNumber: number;
        totalQuestions: number;
      }) => {
        console.log("ゲーム開始:", data);
        setCurrentQuestion(data.question);
        setQuestionNumber(data.questionNumber);
        setTotalQuestions(data.totalQuestions);
        setTimeLeft(QUESTION_TIME_LIMIT);
        setAnswer("");
        setAnswerResult(null);
        setScreen("game");
      }
    );

    // タイマー更新
    socket.on("timer-update", (time: number) => {
      setTimeLeft(time);
    });

    // 次の問題
    socket.on(
      "next-question",
      (data: {
        question: Question;
        questionNumber: number;
        totalQuestions: number;
      }) => {
        console.log("次の問題を受信:", data);
        setCurrentQuestion(data.question);
        setQuestionNumber(data.questionNumber);
        setTotalQuestions(data.totalQuestions);
        setTimeLeft(QUESTION_TIME_LIMIT);
        setAnswer("");
        setAnswerResult(null);
      }
    );

    // 回答結果
    socket.on(
      "answer-result",
      (data: {
        correct: boolean;
        points: number;
        totalScore: number;
        correctAnswer?: string;
      }) => {
        setAnswerResult({
          correct: data.correct,
          points: data.points,
          correctAnswer: data.correctAnswer,
        });
        setMyScore(data.totalScore);
      }
    );

    // ゲーム終了
    socket.on(
      "game-finished",
      (data: { scores: Array<{ name: string; score: number }> }) => {
        setFinalScores(data.scores);
        setScreen("result");
      }
    );

    // エラー処理
    socket.on("error", (data: { message: string }) => {
      alert(data.message);
    });

    // ルームから退出した
    socket.on("left-room", () => {
      setScreen("home");
      setRoomCode("");
      setRoom(null);
      setIsHost(false);
    });

    return () => {
      socket.off("room-created");
      socket.off("player-joined");
      socket.off("player-left");
      socket.off("game-started");
      socket.off("timer-update");
      socket.off("next-question");
      socket.off("answer-result");
      socket.off("game-finished");
      socket.off("error");
      socket.off("left-room");
    };
  }, []);

  // ルーム作成
  const createRoom = () => {
    if (!playerName.trim()) {
      alert("名前を入力してください");
      return;
    }
    setIsHost(true);
    socket.emit("create-room", playerName);
  };

  // ルーム参加
  const joinRoom = () => {
    if (!playerName.trim() || !inputRoomCode.trim()) {
      alert("名前とルームコードを入力してください");
      return;
    }
    socket.emit("join-room", { roomCode: inputRoomCode, playerName });
    setRoomCode(inputRoomCode);
    setScreen("lobby");
  };

  // ゲーム開始
  const startGame = () => {
    if (!room || room.players.length < 1) {
      alert("プレイヤーが必要です");
      return;
    }
    socket.emit("start-game", roomCode);
  };

  // 回答送信
  const submitAnswer = () => {
    socket.emit("submit-answer", { roomCode, answer });
  };

  // ルームから退出
  const leaveRoom = () => {
    socket.emit("leave-room", roomCode);
  };

  // ホーム画面
  if (screen === "home") {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-2 text-indigo-600">
            みんなで幻四字熟語
          </h1>
          <p className="text-center text-gray-600 mb-8">
            意味から空想の四字熟語を当てよう！
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プレイヤー名
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="名前を入力"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
              />
            </div>

            <button
              onClick={createRoom}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              ルームを作成
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ルームコード
              </label>
              <input
                type="text"
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                placeholder="ルームコードを入力"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3 text-black "
              />
              <button
                onClick={joinRoom}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                ルームに参加
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ロビー画面
  if (screen === "lobby") {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-indigo-600 mb-2">ロビー</h2>
            <div className="inline-block bg-indigo-100 px-6 py-2 rounded-lg">
              <span className="text-sm text-gray-600">ルームコード: </span>
              <span className="text-2xl font-bold text-indigo-600">
                {roomCode}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              プレイヤー ({room?.players.length || 0}/4)
            </h3>
            <div className="space-y-3">
              {room?.players.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-800">
                      {player.name}
                    </span>
                    {player.id === room.host && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        ホスト
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {isHost && (
              <button
                onClick={startGame}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition"
              >
                ゲーム開始
              </button>
            )}

            {!isHost && (
              <div className="text-center text-gray-600 py-4">
                ホストがゲームを開始するまでお待ちください...
              </div>
            )}

            <button
              onClick={leaveRoom}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              ルームから退出
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ゲーム画面
  if (screen === "game") {
    if (!currentQuestion) {
      return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
            <div className="text-center text-gray-600">
              問題を読み込んでいます...
            </div>
          </div>
        </div>
      );
    }

    const maskedWord = currentQuestion.word
      .split("")
      .map((char, idx) => {
        return idx === currentQuestion.blank ? "○" : char;
      })
      .join("");

    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-8">
            <div className="text-lg font-semibold text-gray-700">
              問題 {questionNumber}/{totalQuestions}
            </div>
            <div
              className={`text-3xl font-bold ${
                timeLeft <= WARNING_TIME_THRESHOLD
                  ? "text-red-500"
                  : "text-indigo-600"
              }`}
            >
              ⏱ {timeLeft}秒
            </div>
            <div className="text-lg font-semibold text-gray-700">
              スコア: {myScore}点
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-indigo-600 mb-6 tracking-wider">
              {maskedWord}
            </div>
            <p className="text-gray-600 text-lg mb-4">【意味】</p>
            <div className="text-gray-800 text-base mb-4 text-start mx-4">
              {currentQuestion.meaning}
            </div>
            <p className="text-gray-600 text-lg">○に入る文字は？</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="1文字入力"
              maxLength={1}
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
              disabled={answerResult !== null}
            />

            {answerResult === null ? (
              <button
                onClick={submitAnswer}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition"
              >
                回答する
              </button>
            ) : (
              <div
                className={`text-center py-4 rounded-lg ${
                  answerResult.correct
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <div className="text-2xl font-bold mb-2">
                  {answerResult.correct ? "正解！" : "不正解..."}
                </div>
                {!answerResult.correct && answerResult.correctAnswer && (
                  <div className="text-lg mb-2">
                    正解: {answerResult.correctAnswer}
                  </div>
                )}
                <div className="text-lg">+{answerResult.points}点</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 結果画面
  if (screen === "result") {
    const sortedScores = [...finalScores].sort((a, b) => b.score - a.score);

    return (
      <div className="min-h-screen bg-linear-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <h2 className="text-4xl font-bold text-center mb-8 text-orange-600">
            ゲーム終了！
          </h2>

          <div className="space-y-4 mb-8">
            {sortedScores.map((player, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-6 rounded-lg ${
                  index === 0
                    ? "bg-linear-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : index === 2
                        ? "bg-orange-400"
                        : "bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xl font-semibold text-gray-800">
                    {player.name}
                  </span>
                  {index === 0 && <span className="text-2xl">👑</span>}
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {player.score}点
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;

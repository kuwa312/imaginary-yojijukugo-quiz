import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Canvas環境から設定を取得
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Firebase初期化
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// 認証処理
export const authenticate = async () => {
    try {
        if (initialAuthToken) {
            // カスタム認証トークンを使う場合（ここでは省略）
            // await signInWithCustomToken(auth, initialAuthToken);
        } else {
            await signInAnonymously(auth); // 匿名認証
        }
        const user = auth.currentUser;
        if (!user) {
            throw new Error("Authentication failed.");
        }
        
        // プレイヤーIDとランダムな名前をセットアップ
        const userId = user.uid;
        const playerName = `Player ${Math.random().toString(36).substring(2, 7)}`; 
        
        return { userId, playerName };
    } catch (error) {
        console.error("Firebase Authentication Error:", error);
        throw error;
    }
};

// Firestoreのパス設定 (Canvas環境向けの特別なパス)
const ARTIFACTS_COLLECTION = 'artifacts';
const PUBLIC_DATA_PATH = `${ARTIFACTS_COLLECTION}/${appId}/public/data`;
export const ROOMS_COLLECTION = `${PUBLIC_DATA_PATH}/rooms`;

/**
 * ルームの状態をリアルタイムで購読する
 */
export const subscribeToRoom = (roomCode, callback) => {
    if (!roomCode) return () => {};
    const roomRef = doc(db, ROOMS_COLLECTION, roomCode);
    
    return onSnapshot(roomRef, (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data());
        } else {
            callback(null); // ルームが存在しない
        }
    }, (error) => {
        console.error("Room Subscription Error:", error);
    });
};

/**
 * ルームのデータを設定/更新する
 */
export const updateRoomData = async (roomCode, data) => {
    const roomRef = doc(db, ROOMS_COLLECTION, roomCode);
    await setDoc(roomRef, data, { merge: true });
};
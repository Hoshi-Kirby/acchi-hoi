import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "./firebase";
import { useGameStore } from "../../zustand";
import {
  collection,
  getDoc,
  getDocs,
  setDoc,
  orderBy,
  query,
  doc,
  limit,
  getCountFromServer,
  where,
} from "firebase/firestore";

export const Login_db = (): void => {
  const setUid = useGameStore((state) => state.setUid);
  signInWithPopup(auth, provider).then((result) => {
    setUid(result.user.uid);
  });
};

export const Fetch_timeRank = async () => {
  // 1. スコアが高い順にトップ5を取得するクエリを作成
  const q = query(collection(db, "ranking"), orderBy("score", "asc"), limit(5));
  return await getDocs(q);
};

export const Fetch_scoreRank = async () => {
  const q = query(collection(db, "ranking"), orderBy("time", "desc"), limit(5));
  return await getDocs(q);
};
//const test = Fetch_scoreRank()
//test[i].playerName test[i].score test[i].timeみたいな使い方

export const Store_bestScore = async (
  name: string,
  highScore: number,
  uid: string,
) => {
  if (!uid) return;
  try {
    const q = doc(db, "ranking", uid);
    await setDoc(
      q,
      {
        playerID: uid,
        playerName: name, // Googleアカウントの名前
        score: highScore,
      },
      { merge: true },
    );
  } catch (error) {
    console.error("投稿えらー", error);
  }
};

export const Store_bestTime = async (
  name: string,
  highScore2: number,
  uid: string,
) => {
  if (!uid) return;
  try {
    const q = doc(db, "ranking", uid);
    await setDoc(
      q,
      {
        playerID: uid,
        playerName: name,
        time: highScore2,
      },
      { merge: true },
    );
  } catch (error) {
    console.error("投稿エラー", error);
  }
};

export const Fetch_myScoreRank = async (uid: string) => {
  if (!uid) return;
  const qq = doc(db, "ranking", uid);
  const docSnap = await getDoc(qq);
  if (!docSnap.exists()) return null;
  const q = query(
    collection(db, "rankings"),
    where("score", ">", docSnap.data().score), // 自分よりスコアが高い人を抽出
  );

  const snapshot = await getCountFromServer(q);
  // 「自分より高い人の数 + 1」が自分の順位
  return snapshot.data().count + 1;
};

export const Fetch_myTimeRank = async (uid: string) => {
  if (!uid) return;
  const qq = doc(db, "ranking", uid);
  const docSnap = await getDoc(qq);
  if (!docSnap.exists()) return null;
  const q = query(
    collection(db, "rankings"),
    where("score", "<", docSnap.data().time), // 自分よりスコアが高い人を抽出
  );

  const snapshot = await getCountFromServer(q);
  // 「自分より高い人の数 + 1」が自分の順位
  return snapshot.data().count + 1;
};

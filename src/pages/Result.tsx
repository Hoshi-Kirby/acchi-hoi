import React, { useState, useEffect, useRef } from "react";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../zustand";
import { AchievementPopup } from "../features/game/components/AchievementPopup.tsx";
import {
  useLogin_db,
  Fetch_timeRank,
  Fetch_scoreRank,
  Store_bestTime,
  Store_bestScore,
  Fetch_myTimeRank,
  Fetch_myScoreRank,
} from "../features/firebase/tools.ts";
import type { QuerySnapshot, DocumentData } from "firebase/firestore";
import resultFrame from "../assets/resultFrame.png";
import rankFrame from "../assets/rank.png";
import Abutton from "../assets/buttonA.mp3";
import Bbutton from "../assets/buttonD.mp3";
import BGM1 from "../assets/resultBGMsummer.mp3";
import BGM2 from "../assets/resultBGMwinter.mp3";
import Cookies from "js-cookie";
type scoreRank = { name: string; score: number; time: number; uid: string };
type timeRank = { name: string; score: number; time: number; uid: string };

const Result: React.FC = () => {
  const playerCount = useGameStore((state) => state.playerCount);
  const isPointSystem = useGameStore((state) => state.isPointSystem);
  const scores = useGameStore((state) => state.scores);
  const navigate = useNavigate();
  const indexedScores = scores.map((score, index) => ({ score, index }));
  const setScore = useGameStore((state) => state.setScore);
  const setLifes = useGameStore((state) => state.setLife);
  const setRound = useGameStore((state) => state.setRound);
  const highScore = useGameStore((state) => state.highScore);
  const setHighScore = useGameStore((state) => state.setHighScore);
  const highScore2 = useGameStore((state) => state.highScore2);
  const setHighScore2 = useGameStore((state) => state.setHighScore2);
  const isTimeAtack: boolean = useGameStore((state) => state.isTimeAtack);
  const timeScore: number = useGameStore((state) => state.timeScore);
  const timeScoreS = Math.min(Math.round(timeScore / 10) / 100, 99.99);
  const [highScoreS, setHighScoreS] = useState<number>(0); //ハイスコアタイムをsにしたもの

  const [getHighScore, setGetHighScore] = useState<boolean>(false);

  const isClear = useGameStore((state) => state.isClear);
  const setIsClear = useGameStore((state) => state.setIsClear);
  const hasAchieved = useGameStore((state) => state.hasAchieved);
  const setHasAchieved = useGameStore((state) => state.setHasAchieved);
  const [Clear, setClear] = useState([...isClear]);
  const [isMenu, setIsMenu] = useState<boolean>(false);
  const setResultEffect = useGameStore((state) => state.setResultEffect);
  const [scoreRankList, setScoreRankList] = useState<scoreRank[] | undefined>(
    undefined,
  );
  const [timeRankList, setTimeRankList] = useState<scoreRank[] | undefined>(
    undefined,
  );

  const [text, setText] = useState("");

  indexedScores.sort((a, b) => b.score - a.score);
  const sortedValues = indexedScores.map((item) => item.score);
  const sortedIndices = indexedScores.map((item) => item.index);

  const uid: string = useGameStore((state) => state.uid);
  const login = useLogin_db();

  const achieve = (index: number) => {
    if (hasAchieved) return;
    // すでに達成している場合は何もしない
    if (Clear[index]) return;

    // Reactのstateも更新
    const newClear = [...Clear];
    newClear[index] = true;
    setClear(newClear);

    // グローバル変数も更新
    setIsClear(index, true);
    setHasAchieved(true);
  };

  const clickStart = () => {
    playSoundA();
    for (let i = 0; i < playerCount; i++) {
      setScore(i, 0);
      setLifes(i, 3);
      setResultEffect(i, null);
    }
    navigate("/Play");
    setRound(1);
  };
  const GotoSetting = () => {
    playSoundA();
    for (let i = 0; i < playerCount; i++) {
      setScore(i, 0);
      setLifes(i, 3);
    }
    setRound(1);
    navigate("/Setup");
  };
  const GotoTitle = () => {
    playSoundB();
    for (let i = 0; i < playerCount; i++) {
      setScore(i, 0);
      setLifes(i, 3);
    }
    setRound(1);
    navigate("/");
  };

  // データを非同期で取得したときにセット
  const rank = async () => {
    playSoundA();
    setIsMenu(true);
    const fetchRanks = async () => {
      try {
        // Firestore から両方の QuerySnapshot を同時に取得
        const [scoreSnapshot, timeSnapshot]: [
          QuerySnapshot<DocumentData>,
          QuerySnapshot<DocumentData>,
        ] = await Promise.all([Fetch_scoreRank(), Fetch_timeRank()]);

        // QuerySnapshot を配列に変換
        const scores: scoreRank[] = scoreSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            name: data.playerName,
            score: data.score,
            time: data.time,
            uid: doc.id,
          };
        });

        const times: timeRank[] = timeSnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(data.playerName);
          return {
            name: data.playerName,
            score: data.score,
            time: data.time,
            uid: doc.id,
          };
        });

        // state にセット
        setScoreRankList(scores);
        setTimeRankList(times);
      } catch (error) {
        console.error("ランキング取得に失敗しました:", error);
      }
    };

    fetchRanks();
  };

  //test[i].playerName test[i].score test[i].time

  const BB = () => {
    playSoundA();
    setIsMenu(false);
  };
  const GN = () => {
    login();
    console.log(uid);

    Store_bestTime(text, highScoreS, uid);
    Store_bestScore(text, highScore, uid);
    Fetch_myTimeRank(uid);
    Fetch_myScoreRank(uid);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    const filtered = input
      .replace(/[^a-zA-ZＡ-Ｚａ-ｚ0-9０-９ぁ-んァ-ン一-龠_-ー]/g, "")
      .slice(0, 10); // 10文字で切り詰め

    setText(filtered);
  };
  const audioRefA = useRef<HTMLAudioElement | null>(null);
  const playSoundA = () => {
    if (!audioRefA.current) {
      audioRefA.current = new Audio(Abutton);
    }
    audioRefA.current.currentTime = 0;
    audioRefA.current.play();
  };
  const audioRefB = useRef<HTMLAudioElement | null>(null);
  const playSoundB = () => {
    if (!audioRefB.current) {
      audioRefB.current = new Audio(Bbutton);
    }
    audioRefB.current.currentTime = 0;
    audioRefB.current.play();
  };

  useEffect(() => {
    if (!isTimeAtack) {
      if (sortedValues[0] > highScore) {
        setHighScore(sortedValues[0]);
        setGetHighScore(true);
        Cookies.set("cookieHighScore", String(sortedValues[0]), {
          expires: 365,
        });
      }
      if (!isPointSystem && scores.includes(1)) {
        achieve(6);
      }
    } else {
      if (timeScore < highScore2) {
        setHighScore2(timeScore);
        Cookies.set("cookieTimeHighScore", String(timeScore));
        setGetHighScore(true);
        setHighScoreS(Math.round(timeScore / 10) / 100);
      } else {
        setHighScoreS(Math.round(highScore2 / 10) / 100);
      }
      if (isTimeAtack && timeScoreS < 20) {
        achieve(5);
      }
    }
  }, []);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.2;
    audio.play();

    return () => {
      audio.pause();
    };
  }, []);
  return (
    <div className="game-container">
      <div className="back"></div>
      {getHighScore ? (
        <audio ref={audioRef} src={BGM1} autoPlay loop />
      ) : (
        <audio ref={audioRef} src={BGM2} autoPlay loop />
      )}
      <div className="resultWrapper">
        <div className="result-text">結果発表</div>
        <div className="result-wrapper">
          <img src={resultFrame} alt="result" className="resultImage" />
          {!isTimeAtack ? (
            <div className="result-table">
              {Array.from({ length: playerCount }).map((_, i) => (
                <div className="result-packet" key={i}>
                  {i + 1}位 {sortedIndices[i] + 1}p {sortedValues[i]}pt
                </div>
              ))}
            </div>
          ) : (
            <div className="result-table">
              <div className="result-packet">　　{timeScoreS}s</div>
            </div>
          )}
        </div>

        <div className="HighScore">
          {!isTimeAtack ? (
            <div className="result-text2">ハイスコア:{highScore}pt</div>
          ) : (
            <div className="result-text2">ハイスコア:{highScoreS}s</div>
          )}
          {getHighScore && <div className="result-text3">ハイスコア更新！</div>}
        </div>
        <div className="result-buttons">
          <button className="result-button" onClick={clickStart}>
            もういちど
          </button>
          <button className="result-button" onClick={GotoSetting}>
            設定へ
          </button>
          <button className="result-button" onClick={GotoTitle}>
            タイトルへ
          </button>
        </div>
      </div>
      <button className="rank-button" onClick={rank}>
        ランキング
      </button>

      <div className={`overlay ${isMenu ? "open" : ""}`}>
        <button className="back-button" onClick={BB}>
          戻る
        </button>
        <div className="rank-wrapper">
          <img src={rankFrame} alt="menu" className="rankImage" />
          <div className="rank-text-left">残機制</div>
          <div className="rank-text-right">タイムアタック</div>
          <ol className="rank-left">
            {scoreRankList?.map((item) => (
              <li key={item.uid}>
                {item.name} {item.score}点
              </li>
            ))}
          </ol>
          <ol className="rank-right">
            {timeRankList?.map((item) => (
              <li key={item.uid}>
                {item.name} {item.time}s
              </li>
            ))}
          </ol>
          <div className="my-text-left">あなたの最高記録</div>
          <div className="my-text-right">あなたの最高記録</div>
          <div className="my-left">{highScore}pt</div>
          <div className="my-right">{highScoreS}s</div>
        </div>
        <div className="gt-wrapper">
          <div>
            <input
              maxLength={10}
              type="text"
              value={text}
              onChange={handleChange}
              placeholder="ニックネーム(10文字まで)"
              className="input-box"
            />
          </div>
          <button className="gt-button" onClick={GN}>
            記録をアップロード
          </button>
        </div>
      </div>

      <div className="achievement-layer">
        <AchievementPopup Clear={Clear[5]} title="脊髄反射" />
        <AchievementPopup Clear={Clear[6]} title="今日はこのへんで" />
      </div>
    </div>
  );
};

export default Result;

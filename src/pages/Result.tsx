import React, { useState, useEffect, useRef } from "react";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../zustand";
import { AchievementPopup } from "../features/game/components/AchievementPopup.tsx";
import resultFrame from "../assets/resultFrame.png";
import Abutton from "../assets/buttonA.mp3";
import Bbutton from "../assets/buttonD.mp3";
import BGM1 from "../assets/resultBGMsummer.mp3";
import BGM2 from "../assets/resultBGMwinter.mp3";
import Cookies from "js-cookie";

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

  indexedScores.sort((a, b) => b.score - a.score);
  const sortedValues = indexedScores.map((item) => item.score);
  const sortedIndices = indexedScores.map((item) => item.index);

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
    }
    setRound(1);
    navigate("/Play");
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
  const rank = () => {
    playSoundA();
    setIsMenu(true);
  };

  const BB = () => {
    playSoundA();
    setIsMenu(false);
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
      if (isTimeAtack && timeScoreS < 25) {
        achieve(5);
      }
    }
  }, []);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // 音量を20%に設定
    }
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
      </div>

      <div className="achievement-layer">
        <AchievementPopup Clear={Clear[5]} title="脊髄反射" />
        <AchievementPopup Clear={Clear[6]} title="今日はこのへんで" />
      </div>
    </div>
  );
};

export default Result;

import React, { useState, useEffect, useRef } from "react";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../zustand";
import Abutton from "../assets/buttonA.mp3";
import Bbutton from "../assets/buttonD.mp3";
import BGM1 from "../assets/resultBGMsummer.mp3";
import BGM2 from "../assets/resultBGMwinter.mp3";
import Cookies from "js-cookie";

const Result: React.FC = () => {
  const playerCount = useGameStore((state) => state.playerCount);
  const scores = useGameStore((state) => state.scores);
  const navigate = useNavigate();
  const indexedScores = scores.map((score, index) => ({ score, index }));
  const setScore = useGameStore((state) => state.setScore);
  const setLifes = useGameStore((state) => state.setLife);
  const setRound = useGameStore((state) => state.setRound);
  const highScore = useGameStore((state) => state.highScore);
  const setHighScore = useGameStore((state) => state.setHighScore);

  const [getHighScore, setGetHighScore] = useState<boolean>(false);

  indexedScores.sort((a, b) => b.score - a.score);
  const sortedValues = indexedScores.map((item) => item.score);
  const sortedIndices = indexedScores.map((item) => item.index);

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
    if (sortedValues[0] > highScore) {
      setHighScore(sortedValues[0]);
      setGetHighScore(true);
      Cookies.set("cookieHighScore", String(sortedValues[0]), { expires: 365 });
    }
  }, []);
  return (
    <div className="game-container">
      <div className="back"></div>
      {getHighScore ? (
        <audio src={BGM1} autoPlay loop />
      ) : (
        <audio src={BGM2} autoPlay loop />
      )}
      <div className="result-text">結果発表</div>
      <div className="result-table">
        {Array.from({ length: playerCount }).map((_, i) => (
          <div className="result-packet" key={i}>
            {i + 1}位 {sortedIndices[i] + 1}p {sortedValues[i]}pt
          </div>
        ))}
      </div>
      <div className="result-text2">ハイスコア:{highScore}pt</div>
      {getHighScore && <div className="result-text3">ハイスコア更新！</div>}
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
  );
};

export default Result;

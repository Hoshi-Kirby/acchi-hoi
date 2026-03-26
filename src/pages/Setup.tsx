import React, { useEffect, useState, useRef } from "react";
import "./Pages.css";
// import { useNavigate } from "react-router-dom";
import { useGameStore } from "../zustand";
import { useNavigate } from "react-router-dom";
import left_arrow from "../assets/left_arrow.png";
import right_arrow from "../assets/right_arrow.png";
import left_C from "../assets/left_C.png";
import right_C from "../assets/right_C.png";
import Abutton from "../assets/buttonA.mp3";
import Bbutton from "../assets/buttonD.mp3";
import BGm from "../assets/settingBGM.mp3";

const Setup: React.FC = () => {
  // グローバル変数
  const playerCount = useGameStore((state) => state.playerCount);
  const increasePlayerCount = useGameStore(
    (state) => state.increasePlayerCount,
  );
  const decreasePlayerCount = useGameStore(
    (state) => state.decreasePlayerCount,
  );
  const showingCharacter = useGameStore((state) => state.showingCharacter);
  const setShowingCharacter = useGameStore(
    (state) => state.setShowingCharacter,
  );
  const isPointSystem = useGameStore((state) => state.isPointSystem);
  const setIsPointSystem = useGameStore((state) => state.setIsPointSystem);
  const setRound = useGameStore((state) => state.setRound);

  const highScore = useGameStore((state) => state.highScore);

  const [addC, setAddC] = useState<string[]>(["", "", ""]);

  type Direction = "left" | "right";
  type DirectionC = `${Direction}c`;

  type ArrowKey = Direction | DirectionC;
  const arrowImages = {
    left: left_arrow,
    right: right_arrow,
    leftc: left_C,
    rightc: right_C,
  };
  // 画面遷移処理

  const navigate = useNavigate();
  const clickBack = () => {
    playSoundA();
    navigate("/");
  };
  const clickStart = () => {
    playSoundB();
    setRound(1);
    navigate(showingCharacter ? "/SetChara" : "/Play");
  };

  // 変数の変動処理
  const decreaseNumber = () => {
    playSoundA();
    if (playerCount > 1) {
      decreasePlayerCount();
    }
  };
  const increaseNumber = () => {
    playSoundA();
    if (playerCount < 4) {
      increasePlayerCount();
    }
  };
  const modeTrue = () => {
    playSoundA();
    setShowingCharacter(true);
  };
  const modeFalse = () => {
    playSoundA();
    setShowingCharacter(false);
  };
  const pointTrue = () => {
    playSoundA();
    setIsPointSystem(true);
  };
  const pointFalse = () => {
    playSoundA();
    setIsPointSystem(false);
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
    if (highScore > 25) {
      setAddC(["c", "c", "c"]);
    } else if (highScore > 20) {
      setAddC(["c", "c", ""]);
    } else if (highScore > 16) {
      setAddC(["c", "", ""]);
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
      <audio ref={audioRef} src={BGm} autoPlay loop />
      <div className="setup1">
        <div>参加人数　　</div>
        <img
          src={arrowImages[("left" + addC[2]) as ArrowKey]}
          onClick={decreaseNumber}
          className="triangle"
        />
        <div className="setup-text">{playerCount}</div>
        <img
          src={arrowImages[("right" + addC[2]) as ArrowKey]}
          onClick={increaseNumber}
          className="triangle"
        />
      </div>
      <div className="setup2">
        <div>表示モード　</div>
        <img
          src={arrowImages[("left" + addC[1]) as ArrowKey]}
          onClick={modeTrue}
          className="triangle"
        />
        <div className="setup-text">{showingCharacter ? "キャラ" : "映像"}</div>
        <img
          src={arrowImages[("right" + addC[1]) as ArrowKey]}
          onClick={modeFalse}
          className="triangle"
        />
      </div>
      <div className="setup3">
        <div>ゲームモード</div>
        <img
          src={arrowImages[("left" + addC[0]) as ArrowKey]}
          onClick={pointTrue}
          className="triangle"
        />
        <div className="setup-text">
          {isPointSystem ? "ポイント制" : "残機制"}
        </div>
        <img
          src={arrowImages[("right" + addC[0]) as ArrowKey]}
          onClick={pointFalse}
          className="triangle"
        />
      </div>
      <button className="back-button" onClick={clickBack}>
        戻る
      </button>
      <button className="setup-start-button" onClick={clickStart}>
        GameStart!
      </button>
    </div>
  );
};

export default Setup;

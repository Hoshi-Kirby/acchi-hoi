import React, { useRef, useEffect } from "react";
import "./Pages.css";
// import { useNavigate } from "react-router-dom";
import { useGameStore } from "../zustand";
import { useNavigate } from "react-router-dom";
import p1w from "../assets/p1wN.png";
import p1m from "../assets/p1mN.png";
import p2w from "../assets/p2wN.png";
import p2m from "../assets/p2mN.png";
import p3w from "../assets/p3wN.png";
import p3m from "../assets/p3mN.png";
import p4w from "../assets/p4wN.png";
import p4m from "../assets/p4mN.png";
import left_arrow from "../assets/left_arrow.png";
import right_arrow from "../assets/right_arrow.png";
import left_C from "../assets/left_C.png";
import right_C from "../assets/right_C.png";
import Abutton from "../assets/buttonA.mp3";
import Bbutton from "../assets/buttonD.mp3";
import BGm from "../assets/settingBGM.mp3";
const pnw = [p1w, p2w, p3w, p4w];
const pnm = [p1m, p2m, p3m, p4m];

const SetChara: React.FC = () => {
  // グローバル変数
  const playerCount = useGameStore((state) => state.playerCount);
  const isMaleCharacter = useGameStore((state) => state.isMaleCharacter);
  const setIsMaleCharacter = useGameStore((state) => state.setIsMaleCharacter);
  // 画面遷移処理

  const navigate = useNavigate();
  const clickBack = () => {
    playSoundA();
    navigate("/Setup");
  };
  const clickStart = () => {
    playSoundB();
    navigate("/Play");
  };

  // 変数の変動処理
  const clickLeft = (n: number) => {
    playSoundA();
    setIsMaleCharacter(n - 1, true);
  };
  const clickRight = (n: number) => {
    playSoundA();
    setIsMaleCharacter(n - 1, false);
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
      <div className="set-chara-text">キャラ選択</div>
      <div className="chara-content">
        {Array.from({ length: playerCount }).map((_, i) => (
          <div className="chara-packet-content" key={i}>
            <div className="chara-packet">
              <img
                src={left_arrow}
                className="triangle"
                onClick={() => clickLeft(i + 1)}
              />
              <img
                src={isMaleCharacter[i] ? pnm[i] : pnw[i]}
                className="image"
              />
              <img
                src={right_arrow}
                className="triangle"
                onClick={() => clickRight(i + 1)}
              />
            </div>
            <div className="iplayer">{i + 1}p</div>
          </div>
        ))}
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

export default SetChara;

import React, { useRef, useEffect } from "react";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/titleLogo.png";
import Bbutton from "../assets/buttonS.mp3";
import Bgm from "../assets/titleBGM.mp3";
// import { bgm } from "../features/music/BGMprovider";
import { useGameStore } from "../zustand";
import Cookies from "js-cookie";

const Title: React.FC = () => {
  const navigate = useNavigate();
  const clickStart = () => {
    playSoundB();
    navigate("/Setup");
  };
  const audioRefB = useRef<HTMLAudioElement | null>(null);
  const playSoundB = () => {
    if (!audioRefB.current) {
      audioRefB.current = new Audio(Bbutton);
    }
    audioRefB.current.currentTime = 0;
    audioRefB.current.play();
  };
  useEffect(() => {}, []);

  const setHighScore = useGameStore((state) => state.setHighScore);

  useEffect(() => {
    const cookieHighScore = Cookies.get("cookieHighScore");
    if (cookieHighScore) {
      const numHighScore: number = Number(cookieHighScore);
      setHighScore(numHighScore);
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
      <audio ref={audioRef} src={Bgm} autoPlay loop />
      <img src={logo} className="title-logo" />
      <button className="title-start-button" onClick={clickStart}>
        Start
      </button>
    </div>
  );
};

export default Title;

import React, { useRef, useEffect, useState } from "react";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/titleLogo.png";
import Bbutton from "../assets/buttonS.mp3";
import Bgm from "../assets/titleBGM.mp3";
// import { bgm } from "../features/music/BGMprovider";
import { useGameStore } from "../zustand";
import Cookies from "js-cookie";

const Title: React.FC = () => {
  const [isSuka, setIsSuka] = useState<boolean>(false);
  const setHighScore = useGameStore((state) => state.setHighScore);
  const setHighScore2 = useGameStore((state) => state.setHighScore2);
  const navigate = useNavigate();
  const clickStart = () => {
    playSoundB();
    navigate("/Setup");
  };
  const clickBack = () => {
    setIsSuka(false);
  };
  const clickDelete = () => {
    setIsSuka(false);
    playSoundB();
    setHighScore(0);
    setHighScore2(99990);
  };
  const clickSuka = () => {
    setIsSuka(true);
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

  useEffect(() => {
    const cookieHighScore = Cookies.get("cookieHighScore");
    const cookieTimeHighScore = Cookies.get("cookieTimeHighScore");
    if (cookieHighScore) {
      setHighScore(Number(cookieHighScore));
    }
    if (cookieTimeHighScore) {
      setHighScore2(Number(cookieTimeHighScore));
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
      <div className="back" onClick={clickBack}></div>
      <audio ref={audioRef} src={Bgm} autoPlay loop />
      <img src={logo} className="title-logo" />
      <button className="title-start-button" onClick={clickStart}>
        Start
      </button>
      <div className="delete-button-wrapper">
        <button
          className="delete"
          onClick={clickSuka}
          onDoubleClick={clickDelete}
        >
          記録を削除する
        </button>
        {isSuka && (
          <div className="suka">削除するにはダブルクリックをしてください</div>
        )}
      </div>
    </div>
  );
};

export default Title;

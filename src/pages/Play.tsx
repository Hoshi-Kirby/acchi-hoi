import React, { useState, useEffect, useRef } from "react";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../zustand";
import Judge from "../features/game/utils/judge";
import p1w from "../assets/p1wN.png";
import p1m from "../assets/p1mN.png";
import p2w from "../assets/p2wN.png";
import p2m from "../assets/p2mN.png";
import p3w from "../assets/p3wN.png";
import p3m from "../assets/p3mN.png";
import p4w from "../assets/p4wN.png";
import p4m from "../assets/p4mN.png";
import up_arrow from "../assets/up_arrow.png";
import down_arrow from "../assets/down_arrow.png";
import left_arrow from "../assets/left_arrow.png";
import right_arrow from "../assets/right_arrow.png";
import menuButton from "../assets/menuButton.png";
import menuFrame from "../assets/menuFrame.png";
import kaSound from "../assets/ka.mp3";
import kanSound from "../assets/kan.mp3";
import { useGameLoop } from "../features/game/hooks/useGameLoop";
const pnw = [p1w, p2w, p3w, p4w];
const pnm = [p1m, p2m, p3m, p4m];
const arrowImages = {
  up: up_arrow,
  down: down_arrow,
  left: left_arrow,
  right: right_arrow,
  center: p1w,
};

const Play = () => {
  const currentDirections = useGameStore((state) => state.currentDirections);
  const playerCount = useGameStore((state) => state.playerCount);
  const isMaleCharacter = useGameStore((state) => state.isMaleCharacter);
  const round: number = useGameStore((state) => state.round); //ゲームのラウンド
  const increaseRound = useGameStore((state) => state.increaseRound);
  const setRound = useGameStore((state) => state.setRound);
  const [timer, settimer] = useState<number>(0); //カウント
  const [gamePhase, setgamePhase] = useState<"waiting" | "arrow" | "judging">(
    "waiting",
  );
  const [count_speed, setcount_speed] = useState<number>(1000); //カウントの時間間隔
  const [isMenu, setIsMenu] = useState<boolean>(false);

  const clickMenu = () => {
    setIsMenu(true);
  };

  const navigate = useNavigate();
  const clickContinue = () => {
    setIsMenu(false);
  };
  const clickStart = () => {
    setRound(0);
    setIsMenu(false);
  };
  const GotoSetting = () => {
    navigate("/Setup");
  };
  const GotoTitle = () => {
    navigate("/");
  };

  useGameLoop(); //ここで矢印の方向を作る関数を呼び出す

  //時間関連の処理を隔離
  const audioRefKa = useRef<HTMLAudioElement | null>(null);
  const audioRefKan = useRef<HTMLAudioElement | null>(null);

  const playSoundKa = () => {
    if (!audioRefKa.current) {
      audioRefKa.current = new Audio(kaSound);
    }
    audioRefKa.current.currentTime = 0;
    audioRefKa.current.playbackRate = 1.0;
    audioRefKa.current.play();
  };
  const playSoundKan = () => {
    if (!audioRefKan.current) {
      audioRefKan.current = new Audio(kanSound);
    }
    audioRefKan.current.currentTime = 0;
    audioRefKan.current.play();
  };

  useEffect(() => {
    if (
      timer === 0 ||
      timer === 1 ||
      timer === 2 ||
      timer === 4 ||
      timer === 5 ||
      timer === 6
    ) {
      playSoundKa();
    }
    if (timer === 3 || timer === 7) {
      playSoundKan();
    }
    if (timer === 4) {
      setgamePhase("arrow");
      console.log("arrow");
    }
    if (timer === 8) {
      setgamePhase("judging");
      console.log("judging");
    }
    if (timer === 10) {
      setgamePhase("waiting");
      console.log("waiting");
      settimer(0);
      increaseRound();
      setcount_speed(Math.max(600 - round * 30, 375));
    }
  }, [timer, gamePhase, round]);

  useEffect(() => {
    //メニューを開いたとき以外はタイマーを動かし続ける
    const intervalId = setInterval(() => {
      if (!isMenu) {
        settimer((prev) => prev + 1);
      }
    }, count_speed);
    return () => clearInterval(intervalId);
  }, [count_speed, isMenu]);

  return (
    <div className="game-container">
      <div className="back"></div>
      <img src={menuButton} className="menu-button" onClick={clickMenu} />
      <div className="play-chara-content">
        {Array.from({ length: playerCount }).map((_, i) => (
          <div className="play-chara-packet-content" key={i}>
            <img
              src={isMaleCharacter[i] ? pnm[i] : pnw[i]}
              className="play-image"
            />
          </div>
        ))}
      </div>
      <div className="judge-display-area">
        {gamePhase === "judging" && <Judge />}
      </div>
      <div className="arrow_up">
        {gamePhase === "arrow" && currentDirections[0] !== null && (
          <img
            className="arroww"
            src={arrowImages[currentDirections[0]]}
            alt="うえ"
          />
        )}
      </div>
      <div className="arrow_right">
        {gamePhase === "arrow" && currentDirections[1] !== null && (
          <img
            className="arroww"
            src={arrowImages[currentDirections[1]]}
            alt="みぎ"
          />
        )}
      </div>
      <div className="arrow_down">
        {gamePhase === "arrow" && currentDirections[2] !== null && (
          <img
            className="arroww"
            src={arrowImages[currentDirections[2]]}
            alt="した"
          />
        )}
      </div>
      <div className="arrow_left">
        {gamePhase === "arrow" && currentDirections[3] !== null && (
          <img
            className="arroww"
            src={arrowImages[currentDirections[3]]}
            alt="ひだり"
          />
        )}
      </div>
      <div className="count">
        {gamePhase === "waiting" && timer !== 4 && <>{3 - timer}</>}
      </div>
      <div className={`overlay ${isMenu ? "open" : ""}`}>
        <div className="menuWrapper">
          <img src={menuFrame} alt="menu" className="menuImage" />
          <div className="menu-text">Pause</div>
          <div className="menuButton">
            <button className="button-inmenu" onClick={clickContinue}>
              つづける
            </button>
            <button className="button-inmenu" onClick={clickStart}>
              もういちど
            </button>
            <button className="button-inmenu" onClick={GotoSetting}>
              設定へ
            </button>
            <button className="button-inmenu" onClick={GotoTitle}>
              タイトルへ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Play;

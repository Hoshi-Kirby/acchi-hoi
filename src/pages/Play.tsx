import React, { useState, useEffect } from "react";
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
import menuButton from "../assets/menuButton.png"; //応急処置
import menuFrame from "../assets/menuFrame.png";
// import useGameLoop from "../features/game/hooks/useGameLoop";
const pnw = [p1w, p2w, p3w, p4w];
const pnm = [p1m, p2m, p3m, p4m];

const Play = () => {
  const currentDirections = useGameStore((state) => state.currentDirections);
  const playerCount = useGameStore((state) => state.playerCount);
  const isMaleCharacter = useGameStore((state) => state.isMaleCharacter);
  const [round, setround] = useState<number>(1); //ゲームのラウンド
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
    setIsMenu(false);
  };
  const GotoSetting = () => {
    navigate("/Setup");
  };
  const GotoTitle = () => {
    navigate("/");
  };

  // useGameLoop(round); //ここで矢印の方向を作る関数を呼び出す

  //時間関連の処理を隔離

  useEffect(() => {
    setcount_speed(750 - round * 30); //テスト中
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
      setround((round) => round + 1);
      setcount_speed(round < 20 ? 600 - round * 30 : 100);
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
        {gamePhase === "arrow" && (
          <img src={currentDirections[0] + "_arrow"} alt="うえ" />
        )}
      </div>
      <div className="arrow_right">
        {gamePhase === "arrow" && (
          <img src={currentDirections[1] + "_arrow"} alt="みぎ" />
        )}
      </div>
      <div className="arrow_down">
        {gamePhase === "arrow" && (
          <img src={currentDirections[2] + "_arrow"} alt="した" />
        )}
      </div>
      <div className="arrow_left">
        {gamePhase === "arrow" && (
          <img src={currentDirections[3] + "_arrow"} alt="ひだり" />
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

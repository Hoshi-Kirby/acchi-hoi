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
import up_C from "../assets/up_C.png";
import down_C from "../assets/down_C.png";
import left_C from "../assets/left_C.png";
import right_C from "../assets/right_C.png";
import u_C from "../assets/u_c.png";
import d_C from "../assets/d_c.png";
import l_C from "../assets/l_c.png";
import r_C from "../assets/r_c.png";
import menuButton from "../assets/menuButton.png";
import menuFrame from "../assets/menuFrame.png";
import kaSound from "../assets/ka.mp3";
import kanSound from "../assets/kan.mp3";
import { useGameLoop } from "../features/game/hooks/useGameLoop";
const pnw = [p1w, p2w, p3w, p4w];
const pnm = [p1m, p2m, p3m, p4m];
type Direction = "up" | "down" | "left" | "right" | "center";
type DirectionC = `${Direction}c`;

type ArrowKey = Direction | DirectionC;
const arrowImages = {
  up: up_arrow,
  down: down_arrow,
  left: left_arrow,
  right: right_arrow,
  upc: up_C,
  downc: down_C,
  leftc: left_C,
  rightc: right_C,
  upcmini: u_C,
  downcmini: d_C,
  leftcmini: l_C,
  rightcmini: r_C,
  center: p1w,
  centerc: p1w,
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
  const [addC, setAddC] = useState<string>("");

  const clickMenu = () => {
    setIsMenu(true);
  };

  const navigate = useNavigate();
  const clickContinue = () => {
    settimer(10);
    setIsMenu(false);
  };
  const clickStart = () => {
    setgamePhase("waiting");
    settimer(0);
    setRound(0);
    setIsMenu(false);
  };
  const GotoSetting = () => {
    settimer(0);
    navigate("/Setup");
  };
  const GotoTitle = () => {
    settimer(0);
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
    setcount_speed(Math.max(600 - round * 30, 375));
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
    }
  }, [timer, gamePhase, round]);
  useEffect(() => {
    if (round > 16) {
      setAddC("c");
    }
    if (round > 20) {
      setAddC("cmini");
    }
  }, [round]);

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
      {gamePhase === "arrow" && !isMenu && (
        <>
          <div className="arrow_up">
            {currentDirections[0] !== null && (
              <img
                className="arroww"
                src={arrowImages[(currentDirections[0] + addC) as ArrowKey]}
                alt="うえ"
              />
            )}
          </div>
          <div className="arrow_right">
            {currentDirections[1] !== null && (
              <img
                className="arroww"
                src={arrowImages[(currentDirections[1] + addC) as ArrowKey]}
                alt="みぎ"
              />
            )}
          </div>
          <div className="arrow_down">
            {currentDirections[2] !== null && (
              <img
                className="arroww"
                src={arrowImages[(currentDirections[2] + addC) as ArrowKey]}
                alt="した"
              />
            )}
          </div>
          <div className="arrow_left">
            {currentDirections[3] !== null && (
              <img
                className="arroww"
                src={arrowImages[(currentDirections[3] + addC) as ArrowKey]}
                alt="ひだり"
              />
            )}
          </div>
          {round > 12 && (
            <>
              <div className="arrow_upleft">
                {currentDirections[4] !== null && (
                  <img
                    className="arroww"
                    src={arrowImages[(currentDirections[4] + addC) as ArrowKey]}
                    alt="うえ"
                  />
                )}
              </div>
              <div className="arrow_upright">
                {currentDirections[5] !== null && (
                  <img
                    className="arroww"
                    src={arrowImages[(currentDirections[5] + addC) as ArrowKey]}
                    alt="みぎ"
                  />
                )}
              </div>
              <div className="arrow_downleft">
                {currentDirections[6] !== null && (
                  <img
                    className="arroww"
                    src={arrowImages[(currentDirections[6] + addC) as ArrowKey]}
                    alt="した"
                  />
                )}
              </div>
              <div className="arrow_downright">
                {currentDirections[7] !== null && (
                  <img
                    className="arroww"
                    src={arrowImages[(currentDirections[7] + addC) as ArrowKey]}
                    alt="ひだり"
                  />
                )}
              </div>
            </>
          )}
        </>
      )}

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

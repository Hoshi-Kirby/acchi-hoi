import React, { useState, useEffect, useRef } from "react";
import { useInterface } from "../features/game/hooks/interface";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../zustand";
import Judge from "../features/game/utils/judge";
import p1wN from "../assets/p1wN.png";
import p1mN from "../assets/p1mN.png";
import p2wN from "../assets/p2wN.png";
import p2mN from "../assets/p2mN.png";
import p3wN from "../assets/p3wN.png";
import p3mN from "../assets/p3mN.png";
import p4wN from "../assets/p4wN.png";
import p4mN from "../assets/p4mN.png";
import p1wR from "../assets/p1wR.png";
import p1mR from "../assets/p1mR.png";
import p2wR from "../assets/p2wR.png";
import p2mR from "../assets/p2mR.png";
import p3wR from "../assets/p3wR.png";
import p3mR from "../assets/p3mR.png";
import p4wR from "../assets/p4wR.png";
import p4mR from "../assets/p4mR.png";
import p1wL from "../assets/p1wL.png";
import p1mL from "../assets/p1mL.png";
import p2wL from "../assets/p2wL.png";
import p2mL from "../assets/p2mL.png";
import p3wL from "../assets/p3wL.png";
import p3mL from "../assets/p3mL.png";
import p4wL from "../assets/p4wL.png";
import p4mL from "../assets/p4mL.png";
import p1wU from "../assets/p1wU.png";
import p1mU from "../assets/p1mU.png";
import p2wU from "../assets/p2wU.png";
import p2mU from "../assets/p2mU.png";
import p3wU from "../assets/p3wU.png";
import p3mU from "../assets/p3mU.png";
import p4wU from "../assets/p4wU.png";
import p4mU from "../assets/p4mU.png";
import p1wD from "../assets/p1wD.png";
import p1mD from "../assets/p1mD.png";
import p2wD from "../assets/p2wD.png";
import p2mD from "../assets/p2mD.png";
import p3wD from "../assets/p3wD.png";
import p3mD from "../assets/p3mD.png";
import p4wD from "../assets/p4wD.png";
import p4mD from "../assets/p4mD.png";
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
import Abutton from "../assets/buttonA.mp3";
import { useGameLoop } from "../features/game/hooks/useGameLoop";
import type { phase } from "../zustand";
const playerImages = {
  center: { m: [p1mN, p2mN, p3mN, p4mN], w: [p1wN, p2wN, p3wN, p4wN] },
  right: { m: [p1mR, p2mR, p3mR, p4mR], w: [p1wR, p2wR, p3wR, p4wR] },
  left: { m: [p1mL, p2mL, p3mL, p4mL], w: [p1wL, p2wL, p3wL, p4wL] },
  up: { m: [p1mU, p2mU, p3mU, p4mU], w: [p1wU, p2wU, p3wU, p4wU] },
  down: { m: [p1mD, p2mD, p3mD, p4mD], w: [p1wD, p2wD, p3wD, p4wD] },
};
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
  center: p1wN,
  centerc: p1wN,
};

const Play = () => {
  const currentDirections = useGameStore((state) => state.currentDirections);
  const playerDirections = useGameStore((state) => state.playerDirections);
  const playerCount = useGameStore((state) => state.playerCount);
  const isMaleCharacter = useGameStore((state) => state.isMaleCharacter);
  const round: number = useGameStore((state) => state.round); //ゲームのラウンド
  const increaseRound = useGameStore((state) => state.increaseRound);
  const setRound = useGameStore((state) => state.setRound);
  const setScore = useGameStore((state) => state.setScore);
  const setLife = useGameStore((state) => state.setLife);
  const phase: phase = useGameStore((state) => state.phase);
  const setPhase = useGameStore((state) => state.setPhase);

  const lives: number[] = useGameStore((state) => state.lives);
  const isPointSystem: boolean = useGameStore((state) => state.isPointSystem);
  const scores = useGameStore((state) => state.scores);
  const [timer, settimer] = useState<number>(0); //カウント

  const [count_speed, setcount_speed] = useState<number>(1000); //カウントの時間間隔
  const [isMenu, setIsMenu] = useState<boolean>(false);
  const [addC, setAddC] = useState<string[]>(["", "", "", "", "", "", "", ""]);

  const clickMenu = () => {
    playSoundA();
    setIsMenu(true);
  };

  const navigate = useNavigate();
  const clickContinue = () => {
    playSoundA();
    setIsMenu(false);
  };
  const clickStart = () => {
    setPhase("waiting");
    playSoundA();
    setAddC(Array(8).fill(""));
    settimer(0);
    setRound(1);
    for (let i = 0; i < playerCount; i++) {
      setScore(i, 0);
      setLife(i, 3);
    }
    setIsMenu(false);
  };
  const GotoSetting = () => {
    playSoundA();
    for (let i = 0; i < playerCount; i++) {
      setScore(i, 0);
      setLife(i, 3);
    }
    navigate("/Setup");
  };
  const GotoTitle = () => {
    playSoundA();
    for (let i = 0; i < playerCount; i++) {
      setScore(i, 0);
      setLife(i, 3);
    }
    navigate("/");
  };

  useGameLoop(); //ここで矢印の方向を作る関数を呼び出す
  useInterface(); //ここでキー操作の関数を呼び出す

  //時間関連の処理を隔離
  const audioRefKa = useRef<HTMLAudioElement | null>(null);
  const audioRefKan = useRef<HTMLAudioElement | null>(null);
  const audioRefA = useRef<HTMLAudioElement | null>(null);

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
  const playSoundA = () => {
    if (!audioRefA.current) {
      audioRefA.current = new Audio(Abutton);
    }
    audioRefA.current.currentTime = 0;
    audioRefA.current.play();
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
      setPhase("arrow");
      //console.log("arrow");
    }
    if (timer === 8) {
      setPhase("judging");
      //console.log("judging");
      //ここでゲーム終了の文言を入れてもいいかも
    }
    if (timer === 10) {
      setPhase("waiting");
      //console.log("waiting");
      settimer(0);
      if (!isPointSystem) {
        for (let i = 0; i < playerCount; i++) {
          if (lives[i] > 0) break;
          if (i === playerCount - 1) navigate("/Result"); //残機制のプレイヤーが全員死んだときの画面遷移
        }
      } else {
        if (round === 10) navigate("/Result"); //ポイント制プレイヤーが10ラウンドを終えたときの画面遷移
      }
      increaseRound();
    }
  }, [
    timer,
    phase,
    round,
    increaseRound,
    isPointSystem,
    navigate,
    playerCount,
    setPhase,
  ]);

  useEffect(() => {
    if (round > 16) {
      setAddC(Array(8).fill("c"));
    }
    if (round > 20) {
      setAddC(Array(8).fill("cmini"));
    }
    if (round > 25) {
      const choices = ["", "c", "cmini"];

      const newArray = [];

      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * choices.length);
        newArray.push(choices[randomIndex]);
      }

      setAddC(newArray);
    }
  }, [round]);

  useEffect(() => {
    //メニューを開いたとき以外はタイマーを動かし続ける
    const intervalId = setInterval(() => {
      if (!isMenu) {
        settimer((prev) => prev + 1);
      } else {
        if (phase === "arrow") {
          settimer(8);
        }
      }
    }, count_speed);
    return () => clearInterval(intervalId);
  }, [count_speed, isMenu]);

  useEffect(() => {
    settimer(0);
    setRound(1);
  }, []);

  return (
    <div className="game-container">
      <div className="back-sea"></div>
      <img src={menuButton} className="menu-button" onClick={clickMenu} />
      <div className="play-chara-content">
        {Array.from({ length: playerCount }).map((_, i) => {
          const safeLives = Math.max(0, lives[i]); // 応急処置
          return (
            <div className="play-chara-packet-content" key={i}>
              {/* 上に表示 */}
              <div className={`player-${i} player-status`}>
                {isPointSystem ? `${scores[i]}pt` : "♥".repeat(safeLives)}
              </div>

              {/* キャラクター画像 */}
              <img
                src={
                  playerImages[
                    playerDirections[i] as keyof typeof playerImages
                  ][isMaleCharacter[i] ? "m" : "w"][i]
                }
                className="play-image"
              />
            </div>
          );
        })}
      </div>
      <div className="judge-display-area">
        {phase === "judging" && <Judge />}
      </div>
      <div className="round-text">round {round}</div>
      {phase === "arrow" && !isMenu && (
        <>
          <div className="arrow_up">
            {currentDirections[0] !== null && (
              <img
                className="arroww"
                src={arrowImages[(currentDirections[0] + addC[0]) as ArrowKey]}
                alt="うえ"
              />
            )}
          </div>
          <div className="arrow_right">
            {currentDirections[1] !== null && (
              <img
                className="arroww"
                src={arrowImages[(currentDirections[1] + addC[1]) as ArrowKey]}
                alt="みぎ"
              />
            )}
          </div>
          <div className="arrow_down">
            {currentDirections[2] !== null && (
              <img
                className="arroww"
                src={arrowImages[(currentDirections[2] + addC[2]) as ArrowKey]}
                alt="した"
              />
            )}
          </div>
          <div className="arrow_left">
            {currentDirections[3] !== null && (
              <img
                className="arroww"
                src={arrowImages[(currentDirections[3] + addC[3]) as ArrowKey]}
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
                    src={
                      arrowImages[(currentDirections[4] + addC[4]) as ArrowKey]
                    }
                    alt="うえ"
                  />
                )}
              </div>
              <div className="arrow_upright">
                {currentDirections[5] !== null && (
                  <img
                    className="arroww"
                    src={
                      arrowImages[(currentDirections[5] + addC[5]) as ArrowKey]
                    }
                    alt="みぎ"
                  />
                )}
              </div>
              <div className="arrow_downleft">
                {currentDirections[6] !== null && (
                  <img
                    className="arroww"
                    src={
                      arrowImages[(currentDirections[6] + addC[6]) as ArrowKey]
                    }
                    alt="した"
                  />
                )}
              </div>
              <div className="arrow_downright">
                {currentDirections[7] !== null && (
                  <img
                    className="arroww"
                    src={
                      arrowImages[(currentDirections[7] + addC[7]) as ArrowKey]
                    }
                    alt="ひだり"
                  />
                )}
              </div>
            </>
          )}
        </>
      )}

      <div className="count">
        {phase === "waiting" && timer !== 4 && !isMenu && <>{3 - timer}</>}
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

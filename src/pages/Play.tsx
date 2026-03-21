import React, { useState, useEffect } from "react";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../zustand";
import p1w from "../assets/p1wN.png";
import p1m from "../assets/p1mN.png";
import p2w from "../assets/p2wN.png";
import p2m from "../assets/p2mN.png";
import p3w from "../assets/p3wN.png";
import p3m from "../assets/p3mN.png";
import p4w from "../assets/p4wN.png";
import p4m from "../assets/p4mN.png";
import menuButton from "../assets/menuButton.png";
import menuFrame from "../assets/menuFrame.png";
const pnw = [p1w, p2w, p3w, p4w];
const pnm = [p1m, p2m, p3m, p4m];

const Play: React.FC = () => {
  const playerCount = useGameStore((state) => state.playerCount);
  const isMaleCharacter = useGameStore((state) => state.isMaleCharacter);
  const [round, setround] = useState<number>(1); //ゲームのラウンド
  const [isarrow, setisarrow] = useState<boolean>(false); //矢印の表示
  const [timer, settimer] = useState<number>(3); //カウント
  const [istimer, setistimer] = useState<boolean>(true); //カウントの表示
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
  //時間関連の処理を隔離
  setcount_speed(round < 20 ? 900 - round * 40 : count_speed);

  useEffect(() => {
    const intervalId = setInterval(() => {
      //timerが有効な間は3,2,1,0の順で変化する
      settimer(timer - 1); //timerが0になったら、timerを停止して4に戻す
      if (timer === 0 && istimer) {
        settimer(3);
        //矢印表示
        setisarrow(true);
        setistimer(false);
      }
      if (timer === 0 && !istimer && isarrow) {
        settimer(1);
        //判定開始
        setisarrow(false);
      }
      if (timer === 0 && !istimer && !isarrow) {
        settimer(3);
        setround(round + 1);
        clearInterval(intervalId);
      }
      return () => clearInterval(intervalId);
    }, count_speed);
  }, [count_speed]);

  return (
    <div className="game-container">
      <div className="back"></div>
      <img src={menuButton} className="menu-button" onClick={clickMenu} />
      <div className="play-chara-content">
        {Array.from({ length: playerCount }).map((_, i) => (
          <div className="play-chara-packet-content" key={i}>
            <img
              src={isMaleCharacter[i] ? pnw[i] : pnm[i]}
              className="play-image"
            />
          </div>
        ))}
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

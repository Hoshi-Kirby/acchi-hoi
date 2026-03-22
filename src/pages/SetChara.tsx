// import React, { useState, useEffect } from "react";
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
    navigate("/Setup");
  };
  const clickStart = () => {
    navigate("/Play");
  };

  // 変数の変動処理
  const clickLeft = (n: number) => {
    setIsMaleCharacter(n - 1, true);
  };
  const clickRight = (n: number) => {
    setIsMaleCharacter(n - 1, false);
  };
  return (
    <div className="game-container">
      <div className="back"></div>
      <div className="set-chara-text">キャラ選択</div>
      <div className="chara-content">
        {Array.from({ length: playerCount }).map((_, i) => (
          <div className="chara-packet-content" key={i}>
            <div className="chara-packet">
              <div className="triangle" onClick={() => clickLeft(i + 1)}>
                ◀
              </div>
              <img
                src={isMaleCharacter[i] ? pnm[i] : pnw[i]}
                className="image"
              />
              <div className="triangle" onClick={() => clickRight(i + 1)}>
                ▶
              </div>
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

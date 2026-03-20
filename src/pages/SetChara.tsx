// import React, { useState, useEffect } from "react";
import "./Pages.css";
// import { useNavigate } from "react-router-dom";
import { useGameStore } from "../zustand";
import { useNavigate } from "react-router-dom";

const SetChara: React.FC = () => {
  // グローバル変数
  const playerCount = useGameStore((state) => state.playerCount);

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
    n;
  };
  const clickRight = (n: number) => {
    n;
  };
  return (
    <div className="game-container">
      <div className="back"></div>
      <div className="set-chara-text">キャラ選択</div>
      <div className="chara-content">
        {Array.from({ length: playerCount }).map((_, i) => (
          <div className="chara-packet">
            <div onClick={() => clickLeft(i + 1)}>◀</div>
            <div onClick={() => clickRight(i + 1)}>▶</div>
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

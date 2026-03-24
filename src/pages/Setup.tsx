// import React, { useState, useEffect } from "react";
import "./Pages.css";
// import { useNavigate } from "react-router-dom";
import { useGameStore } from "../zustand";
import { useNavigate } from "react-router-dom";
import left_arrow from "../assets/left_arrow.png";
import right_arrow from "../assets/right_arrow.png";
import left_C from "../assets/left_C.png";
import right_C from "../assets/right_C.png";

const Setup: React.FC = () => {
  // グローバル変数
  const playerCount = useGameStore((state) => state.playerCount);
  const increasePlayerCount = useGameStore(
    (state) => state.increasePlayerCount,
  );
  const decreasePlayerCount = useGameStore(
    (state) => state.decreasePlayerCount,
  );
  const showingCharacter = useGameStore((state) => state.showingCharacter);
  const setShowingCharacter = useGameStore(
    (state) => state.setShowingCharacter,
  );
  const isPointSystem = useGameStore((state) => state.isPointSystem);
  const setIsPointSystem = useGameStore((state) => state.setIsPointSystem);
  const setRound = useGameStore((state) => state.setRound);

  // 画面遷移処理

  const navigate = useNavigate();
  const clickBack = () => {
    navigate("/");
  };
  const clickStart = () => {
    setRound(1);
    navigate(showingCharacter ? "/SetChara" : "/Play");
  };

  // 変数の変動処理
  const decreaseNumber = () => {
    if (playerCount > 1) {
      decreasePlayerCount();
    }
  };
  const increaseNumber = () => {
    if (playerCount < 4) {
      increasePlayerCount();
    }
  };
  const modeTrue = () => {
    setShowingCharacter(true);
  };
  const modeFalse = () => {
    setShowingCharacter(false);
  };
  const pointTrue = () => {
    setIsPointSystem(true);
  };
  const pointFalse = () => {
    setIsPointSystem(false);
  };
  return (
    <div className="game-container">
      <div className="back"></div>
      <div className="setup1">
        <div>参加人数　　</div>
        <img src={left_arrow} onClick={decreaseNumber} className="triangle" />
        <div className="setup-text">{playerCount}</div>
        <img src={right_arrow} onClick={increaseNumber} className="triangle" />
      </div>
      <div className="setup2">
        <div>表示モード　</div>
        <img src={left_arrow} onClick={modeTrue} className="triangle" />
        <div className="setup-text">{showingCharacter ? "キャラ" : "映像"}</div>
        <img src={right_arrow} onClick={modeFalse} className="triangle" />
      </div>
      <div className="setup3">
        <div>ゲームモード</div>
        <img src={left_arrow} onClick={pointTrue} className="triangle" />
        <div className="setup-text">
          {isPointSystem ? "ポイント制" : "残機制"}
        </div>
        <img src={right_arrow} onClick={pointFalse} className="triangle" />
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

export default Setup;

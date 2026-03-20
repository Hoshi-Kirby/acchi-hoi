// import React, { useState, useEffect } from "react";
import "./Pages.css";
// import { useNavigate } from "react-router-dom";
import { useGameStore } from "../zustand";

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

  // 画面遷移処理

  const clickBack = () => {};
  const clickStart = () => {};

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
        <div>参加人数</div>
        <div onClick={decreaseNumber}>◀</div>
        <div>{playerCount}</div>
        <div onClick={increaseNumber}>▶</div>
      </div>
      <div className="setup2">
        <div>表示モード</div>
        <div onClick={modeTrue}>◀</div>
        <div>{showingCharacter ? "キャラ" : "映像"}</div>
        <div onClick={modeFalse}>▶</div>
      </div>
      <div className="setup3">
        <div>ゲームモード</div>
        <div onClick={pointTrue}>◀</div>
        <div>{isPointSystem ? "ポイント制" : "残機制"}</div>
        <div onClick={pointFalse}>▶</div>
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

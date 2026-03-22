// import React, { useState, useEffect } from "react";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../zustand";

const Result: React.FC = () => {
  const playerCount = useGameStore((state) => state.playerCount);
  const scores = useGameStore((state) => state.scores);
  const navigate = useNavigate();
  const indexedScores = scores.map((score, index) => ({ score, index }));

  indexedScores.sort((a, b) => b.score - a.score);
  const sortedValues = indexedScores.map((item) => item.score);
  const sortedIndices = indexedScores.map((item) => item.index);

  const clickStart = () => {
    navigate("/Play");
  };
  const GotoSetting = () => {
    navigate("/Setup");
  };
  const GotoTitle = () => {
    navigate("/");
  };
  return (
    <div className="game-container">
      <div className="back"></div>
      <div className="result-text">結果発表</div>
      <div className="result-table">
        {Array.from({ length: playerCount }).map((_, i) => (
          <div className="result-packet" key={i}>
            {i + 1}位 {sortedIndices[i] + 1}p {sortedValues[i]}pt
          </div>
        ))}
      </div>
      <div className="result-buttons">
        <button className="result-button" onClick={clickStart}>
          もういちど
        </button>
        <button className="result-button" onClick={GotoSetting}>
          設定へ
        </button>
        <button className="result-button" onClick={GotoTitle}>
          タイトルへ
        </button>
      </div>
    </div>
  );
};

export default Result;

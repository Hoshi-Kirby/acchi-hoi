// import React, { useState, useEffect } from "react";
import "./Pages.css";
// import { useNavigate } from "react-router-dom";

const Result: React.FC = () => {
  const clickStart = () => {};
  const GotoSetting = () => {};
  const GotoTitle = () => {};
  return (
    <div className="game-container">
      <div className="back"></div>
      <div className="result-text">結果発表</div>
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

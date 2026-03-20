// import React, { useState, useEffect } from "react";
import "./Pages.css";
// import { useNavigate } from "react-router-dom";

export const Setup: React.FC = () => {
  const clickBack = () => {};
  return (
    <div className="game-container">
      <div className="back"></div>
      <div className="setup-text1">参加人数</div>
      <div className="setup-text2">表示モード</div>
      <button className="back-button" onClick={clickBack}>
        Start
      </button>
    </div>
  );
};

export default Setup;

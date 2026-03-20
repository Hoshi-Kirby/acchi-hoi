// import React, { useState, useEffect } from "react";
import "./Pages.css";
// import { useNavigate } from "react-router-dom";

const Play: React.FC = () => {
  const clickStart = () => {};
  return (
    <div className="game-container">
      <div className="back"></div>
      <div className="title-title">あっちむくなホイ！</div>
      <button className="title-start-button" onClick={clickStart}>
        Start
      </button>
    </div>
  );
};

export default Play;

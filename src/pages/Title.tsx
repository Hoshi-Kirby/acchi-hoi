import React /*, { useState, useEffect } */ from "react";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/titleLogo.png";

const Title: React.FC = () => {
  const navigate = useNavigate();
  const clickStart = () => {
    navigate("/Setup");
  };

  return (
    <div className="game-container">
      <div className="back"></div>
      <img src={logo} className="title-logo" />
      <button className="title-start-button" onClick={clickStart}>
        Start
      </button>
    </div>
  );
};

export default Title;

import React, { useRef, useEffect, useState } from "react";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/titleLogo.png";
import Bbutton from "../assets/buttonS.mp3";
import Bgm from "../assets/titleBGM.mp3";
// import { bgm } from "../features/music/BGMprovider";
import { useGameStore } from "../zustand";
import Cookies from "js-cookie";
import up_arrow from "../assets/up_arrow.png";
import down_arrow from "../assets/down_arrow.png";
import left_arrow from "../assets/left_arrow.png";
import right_arrow from "../assets/right_arrow.png";
import AchieveButton from "../assets/AchieveButton.png";

const arrowImages = {
  left: left_arrow,
  right: right_arrow,
  up: up_arrow,
  down: down_arrow,
};
// type Props = {
//   lineStates: {
//     l1: boolean;
//     l2: boolean;
//     l3: boolean;
//     l4: boolean;
//     l5: boolean;
//     l6: boolean;
//     l7: boolean;
//     l8: boolean;
//   };
//   arrowImages: Record<string, string>;
// };

const Title: React.FC = () => {
  const [isSuka, setIsSuka] = useState<boolean>(false);
  const setHighScore = useGameStore((state) => state.setHighScore);
  const setHighScore2 = useGameStore((state) => state.setHighScore2);
  const isOpen = useGameStore((state) => state.isOpen);
  const isClear = useGameStore((state) => state.isClear);
  const setIsOpen = useGameStore((state) => state.setIsOpen);
  const setIsClear = useGameStore((state) => state.setIsClear);
  const navigate = useNavigate();
  const [isMenu, setIsMenu] = useState<boolean>(false);
  const clickStart = () => {
    playSoundB();
    navigate("/Setup");
  };
  const clickBack = () => {
    setIsSuka(false);
  };
  const clickDelete = () => {
    setIsSuka(false);
    playSoundB();
    setHighScore(0);
    setHighScore2(99990);
  };
  const clickSuka = () => {
    setIsSuka(true);
  };
  const audioRefB = useRef<HTMLAudioElement | null>(null);
  const playSoundB = () => {
    if (!audioRefB.current) {
      audioRefB.current = new Audio(Bbutton);
    }
    audioRefB.current.currentTime = 0;
    audioRefB.current.play();
  };
  const [lineStates] = useState({
    l1: false,
    l2: false,
    l3: false,
    l4: false,
    l5: false,
    l6: false,
    l7: false,
    l8: false,
  });

  const clickMenu = () => {
    setIsMenu(true);
  };

  useEffect(() => {
    const cookieHighScore = Cookies.get("cookieHighScore");
    const cookieTimeHighScore = Cookies.get("cookieTimeHighScore");
    if (cookieHighScore) {
      setHighScore(Number(cookieHighScore));
    }
    if (cookieTimeHighScore) {
      setHighScore2(Number(cookieTimeHighScore));
    }
  }, []);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // 音量を20%に設定
    }
  }, []);

  return (
    <div className="game-container">
      <div className="back" onClick={clickBack}></div>
      <img src={AchieveButton} className="menu-button" onClick={clickMenu} />
      <audio ref={audioRef} src={Bgm} autoPlay loop />
      <img src={logo} className="title-logo" />
      <button className="title-start-button" onClick={clickStart}>
        Start
      </button>
      <div className="delete-button-wrapper">
        <button
          className="delete"
          onClick={clickSuka}
          onDoubleClick={clickDelete}
        >
          記録を削除する
        </button>
        {isSuka && (
          <div className="suka">削除するにはダブルクリックをしてください</div>
        )}
      </div>

      <div className={`overlay ${isMenu ? "open" : ""}`}>
        <div className="grid">
          <div
            className={`line line-horizontal ${isClear[0] ? "active" : ""}`}
            style={{ top: "calc(50% + 100px)", left: "calc(50% - 300px)" }}
          />
          <div
            className={`line line-horizontal ${isClear[0] ? "active" : ""}`}
            style={{ top: "calc(50% + 100px)", left: "calc(50% - 100px)" }}
          />
          <div
            className={`line line-horizontal ${lineStates.l3 ? "active" : ""}`}
            style={{ top: "calc(50% - 100px)", left: "calc(50% - 100px)" }}
          />
          <div
            className={`line line-horizontal ${lineStates.l4 ? "active" : ""}`}
            style={{ top: "calc(50% - 100px)", left: "calc(50% + 100px)" }}
          />
          <div
            className={`line line-vertical ${lineStates.l5 ? "active" : ""}`}
            style={{ top: "calc(50% - 300px)", left: "calc(50% - 100px)" }}
          />
          <div
            className={`line line-vertical ${lineStates.l6 ? "active" : ""}`}
            style={{ top: "calc(50% - 100px)", left: "calc(50% - 100px)" }}
          />
          <div
            className={`line line-vertical ${lineStates.l7 ? "active" : ""}`}
            style={{ top: "calc(50% - 100px)", left: "calc(50% + 100px)" }}
          />
          <div
            className={`line line-vertical ${lineStates.l8 ? "active" : ""}`}
            style={{ top: "calc(50% + 100px)", left: "calc(50% + 100px)" }}
          />

          <div
            className="cell"
            style={{ top: "calc(50% + 100px)", left: "calc(50% - 300px)" }}
          >
            <img
              className={`arrow ${
                isClear[0] ? "clear" : isOpen[0] ? "normal" : "disabled"
              }`}
              src={arrowImages["right"]}
            />
          </div>

          <div
            className="cell"
            style={{ top: "calc(50% + 100px)", left: "calc(50% + 100px)" }}
          >
            <img
              className={`arrow ${
                isClear[1] ? "clear" : isOpen[1] ? "normal" : "disabled"
              }`}
              src={arrowImages["down"]}
            />
          </div>

          <div
            className="cell"
            style={{ top: "calc(50% + 100px)", left: "calc(50% - 100px)" }}
          >
            <img
              className={`arrow ${
                isClear[2] ? "clear" : isOpen[2] ? "normal" : "disabled"
              }`}
              src={arrowImages["up"]}
            />
          </div>

          <div
            className="cell"
            style={{ top: "calc(50% - 300px)", left: "calc(50% - 100px)" }}
          >
            <img
              className={`arrow ${
                isClear[3] ? "clear" : isOpen[3] ? "normal" : "disabled"
              }`}
              src={arrowImages["down"]}
            />
          </div>

          <div
            className="cell"
            style={{ top: "calc(50% - 100px)", left: "calc(50% + 300px)" }}
          >
            <img
              className={`arrow ${
                isClear[4] ? "clear" : isOpen[4] ? "normal" : "disabled"
              }`}
              src={arrowImages["right"]}
            />
          </div>

          <div
            className="cell"
            style={{ top: "calc(50% - 100px)", left: "calc(50% - 100px)" }}
          >
            <img
              className={`arrow ${
                isClear[5] ? "clear" : isOpen[5] ? "normal" : "disabled"
              }`}
              src={arrowImages["right"]}
            />
          </div>

          <div
            className="cell"
            style={{ top: "calc(50% - 100px)", left: "calc(50% + 100px)" }}
          >
            <img
              className={`arrow ${
                isClear[6] ? "clear" : isOpen[6] ? "normal" : "disabled"
              }`}
              src={arrowImages["down"]}
            />
          </div>

          <div
            className="cell"
            style={{ top: "calc(50% + 300px)", left: "calc(50% + 100px)" }}
          >
            <img
              className={`arrow ${
                isClear[7] ? "clear" : isOpen[7] ? "normal" : "disabled"
              }`}
              src={arrowImages["up"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Title;

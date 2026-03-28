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

  const clickMenu = () => {
    setIsMenu(true);
    if (isClear[0]) {
      setIsOpen(1, true);
      setIsOpen(2, true);
    }
    if (isClear[1]) {
      setIsOpen(7, true);
    }
    if (isClear[2]) {
      setIsOpen(3, true);
      setIsOpen(5, true);
    }
    if (isClear[3]) {
      setIsOpen(2, true);
      setIsOpen(5, true);
    }
    if (isClear[5]) {
      setIsOpen(4, true);
      setIsOpen(6, true);
    }
    if (isClear[6]) {
      setIsOpen(1, true);
      setIsOpen(7, true);
    }
    if (isClear[7]) {
      setIsOpen(1, true);
      setIsOpen(6, true);
    }
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
            className={`line line-horizontal ${isClear[5] ? "active" : ""}`}
            style={{ top: "calc(50% - 100px)", left: "calc(50% - 100px)" }}
          />
          <div
            className={`line line-horizontal ${isClear[5] ? "active" : ""}`}
            style={{ top: "calc(50% - 100px)", left: "calc(50% + 100px)" }}
          />
          <div
            className={`line line-vertical ${isClear[2] || isClear[3] ? "active" : ""}`}
            style={{ top: "calc(50% - 300px)", left: "calc(50% - 100px)" }}
          />
          <div
            className={`line line-vertical ${isClear[2] || isClear[3] ? "active" : ""}`}
            style={{ top: "calc(50% - 100px)", left: "calc(50% - 100px)" }}
          />
          <div
            className={`line line-vertical ${isClear[6] || isClear[7] ? "active" : ""}`}
            style={{ top: "calc(50% - 100px)", left: "calc(50% + 100px)" }}
          />
          <div
            className={`line line-vertical ${isClear[1] || isClear[6] || isClear[7] ? "active" : ""}`}
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
            {(isOpen[0] || isClear[0]) && (
              <div className="label">
                {isClear[0] && <div className="title">まずは様子見</div>}
                <div className="desc">初めてこのゲームを起動した。</div>
              </div>
            )}
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
            {(isOpen[1] || isClear[1]) && (
              <div className="label">
                {isClear[1] && <div className="title">連続王</div>}
                <div className="desc">５コンボ達成した。</div>
              </div>
            )}
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
            {(isOpen[2] || isClear[2]) && (
              <div className="label">
                {isClear[2] && <div className="title">全会一致</div>}
                <div className="desc">４人プレイで全員同じ方向を向いた。</div>
              </div>
            )}
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
            {(isOpen[3] || isClear[3]) && (
              <div className="label">
                {isClear[3] && <div className="title">ギリギリセーフ</div>}
                <div className="desc">タイムアップギリギリで反応した。</div>
              </div>
            )}
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
            {(isOpen[4] || isClear[4]) && (
              <div className="label">
                {isClear[4] && <div className="title">もはや視力検査</div>}
                <div className="desc">残機制で15ラウンドに突入した。</div>
              </div>
            )}
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
            {(isOpen[5] || isClear[5]) && (
              <div className="label">
                {isClear[5] && <div className="title">脊髄反射</div>}
                <div className="desc">
                  タイムアタックを２５秒以内にクリアした。
                </div>
              </div>
            )}
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
            {(isOpen[6] || isClear[6]) && (
              <div className="label">
                {isClear[6] && <div className="title">今日はこのへんで</div>}
                <div className="desc">５ラウンド以内に残機が０になった。</div>
              </div>
            )}
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
            {(isOpen[7] || isClear[7]) && (
              <div className="label lab">
                {isClear[7] && <div className="title">方向音痴</div>}
                <div className="desc">正面を向いたまま３連続ミスをした。</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Title;

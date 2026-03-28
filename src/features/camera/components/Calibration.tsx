import { useEffect } from "react";
import { useGameStore } from "../../../zustand";
import "./calibration.css";

const Calibration = () => {
  const timer = useGameStore((state) => state.calibration_timer);
  const playerCount = useGameStore((state) => state.playerCount);
  const increaseCalibration_timer = useGameStore(
    (state) => state.increaseCalibration_timer,
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      increaseCalibration_timer();
    }, 1500);

    return () => clearInterval(intervalId);
  }, [increaseCalibration_timer]); // timerを外せるので、エフェクトが再生成されません
  return (
    <div>
      <div className="instruct">
        {/*(17秒以降でcomponent全体を非表示)+線を引く */}
        {timer < 3 && (
          <h1>画面の指示に従ってキャリブレーションをしてください</h1>
        )}
        {timer > 3 && timer < 6 && <h1>枠の中に移動してください</h1>}
        {timer > 6 && timer < 9 && <h1>下を向いてください</h1>}
        {timer > 9 && timer < 12 && <h1>上を向いてください</h1>}
        {timer > 12 && timer < 15 && <h1>正面を向いてください</h1>}
        {timer > 15 && timer < 17 && <h1>ゲームを開始します</h1>}
      </div>
      {timer < 17 && (
        <div className="container">
          {<div className="column"></div>}
          {playerCount > 1 && <div className="column"></div>}
          {playerCount > 2 && <div className="column"></div>}
          {playerCount > 3 && <div className="column"></div>}
        </div>
      )}
    </div>
  );
};
export default Calibration;

import { useEffect, useRef } from "react"; //useStateからuseRefへの変更で処理の軽量化
import { useGameStore } from "../../../zustand";
import type { Direction } from "../../../zustand";

export const useDirectConverter = () => {
  const token = useRef<boolean[]>([true, true, true, true]); //一回向きが変わったかの判定
  const setplayerDirections = useGameStore(
    (state) => state.setPlayerDirections,
  );
  const cameraDirections = useGameStore((state) => state.cameraDirections);
  const playerCount = useGameStore((state) => state.playerCount);
  const phase = useGameStore((state) => state.phase);
  const playerDirections = useGameStore((state) => state.playerDirections);

  const timer = useRef<number[]>([0, 0, 0, 0]); //何秒間同じ向きでいたかの計測
  const preDirections = useRef<Direction[]>([
    "center",
    "center",
    "center",
    "center",
  ]);

  useEffect(() => {
    if (phase === "waiting") {
      token.current = [true, true, true, true];
    }
  }, [phase]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      timer.current = [
        timer.current[0] + 1,
        timer.current[1] + 1,
        timer.current[2] + 1,
        timer.current[3] + 1,
      ];
      //timer機能

      const currentPhase = useGameStore.getState().phase;
      const currentPd = useGameStore.getState().playerDirections;

      if (currentPhase === "arrow") {
        const math: boolean[] = [true, true, true, true];
        //math:tokenに渡すための一時的な置き場所
        for (let i = 0; i < playerCount; i++) {
          if (
            timer.current[i] > 1 &&
            currentPd[i] !== preDirections.current[i]
          ) {
            math[i] = false;
          } else {
            math[i] = token.current[i];
          }
        }
        token.current = math;
      }
    }, 50); //50ミリ秒ごとに実行
    return () => clearInterval(intervalId);
  }, [playerCount]);

  useEffect(() => {
    if (phase === "waiting") {
      preDirections.current = [
        cameraDirections[0],
        cameraDirections[1],
        cameraDirections[2],
        cameraDirections[3],
      ];
    }
  }, [timer.current, phase, cameraDirections]);

  useEffect(() => {
    timer.current = [0, timer.current[1], timer.current[2], timer.current[3]];
  }, [cameraDirections[0]]);
  useEffect(() => {
    timer.current = [timer.current[0], 0, timer.current[2], timer.current[3]];
  }, [cameraDirections[1]]);
  useEffect(() => {
    timer.current = [timer.current[0], timer.current[1], 0, timer.current[3]];
  }, [cameraDirections[2]]);
  useEffect(() => {
    timer.current = [timer.current[0], timer.current[1], timer.current[2], 0];
  }, [cameraDirections[3]]);

  useEffect(() => {
    for (let i = 0; i < playerCount; i++) {
      if (
        ((token.current[i] && cameraDirections[i] !== "center") ||
          phase !== "arrow") &&
        cameraDirections[i] !== null
      ) {
        if (playerDirections[i] !== cameraDirections[i]) {
          setplayerDirections(i, cameraDirections[i]);
        }
      }
    }
  }, [
    cameraDirections,
    setplayerDirections,
    phase,
    playerCount,
    playerDirections,
  ]);
};

import { useEffect, useState } from "react";
import { useGameStore } from "../../../zustand";

export const useDirectConverter = () => {
  const [token, setToken] = useState<boolean[]>([true, true, true, true]);
  const setplayerDirections = useGameStore(
    (state) => state.setPlayerDirections,
  );
  const cameraDirections = useGameStore((state) => state.cameraDirections);
  const playerCount = useGameStore((state) => state.playerCount);
  const phase = useGameStore((state) => state.phase);
  const [timer, setTimer] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    if (phase === "waiting") {
      setToken([true, true, true, true]);
    }
  }, [phase]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prev) => [prev[0] + 1, prev[1] + 1, prev[2] + 1, prev[3] + 1]);
    });
    return clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setTimer((prev) => [0, prev[1], prev[2], prev[3]]);
  }, [cameraDirections[0]]);
  useEffect(() => {
    setTimer((prev) => [prev[0], 0, prev[2], prev[3]]);
  }, [cameraDirections[1]]);
  useEffect(() => {
    setTimer((prev) => [prev[0], prev[1], 0, prev[3]]);
  }, [cameraDirections[2]]);
  useEffect(() => {
    setTimer((prev) => [prev[0], prev[1], prev[2], 0]);
  }, [cameraDirections[3]]);

  useEffect(() => {
    if (phase === "arrow") {
      const math: boolean[] = [true, true, true, true];
      for (let i = 0; i < playerCount; i++) {
        if (timer[i] > 1) {
          math[i] = false;
        } else {
          math[i] = token[i];
        }
      }
      setToken([math[0], math[1], math[2], math[3]]);
    }
  }, [timer]);

  useEffect(() => {
    for (let i = 0; i < playerCount; i++) {
      if ((token[i] || phase !== "arrow") && cameraDirections[i] !== null) {
        setplayerDirections(i, cameraDirections[i]);
      }
    }
  }, [cameraDirections, setplayerDirections]);
};

import React, { useEffect } from "react";
import { useGameStore } from "../../../zustand";
export const Judge: React.FC = () => {
  type Direction = "up" | "down" | "left" | "right" | "center" | null;

  const currentDirections: Direction[] = useGameStore(
    //ストアから値を取得
    (state) => state.currentDirections,
  );
  const playerDirections: Direction[] = useGameStore(
    (state) => state.playerDirections,
  );
  const playerCount: number = useGameStore((state) => state.playerCount);
  const isPointSystem: boolean = useGameStore((state) => state.isPointSystem);
  const setScore = useGameStore((state) => state.setScore);
  const setLife = useGameStore((state) => state.setLife);
  const lives: number[] = useGameStore((state) => state.lives);
  const scores: number[] = useGameStore((state) => state.scores);
  useEffect(() => {
    let counter: number = 0;
    for (let i = 0; i < playerCount; i++) {
      for (const element2 of currentDirections) {
        if (playerDirections[i] === element2) break;
        counter = counter + 1;
      }
      if (
        counter === currentDirections.length &&
        playerDirections[i] !== "center" &&
        lives[i] > 0
      ) {
        setScore(i, scores[i] + 1);
        console.log(scores);
      } else {
        if (!isPointSystem && lives[i] > 0) {
          setLife(i, lives[i] - 1);
          console.log(lives);
        }
      }
    }
    // console.log(scores);
  }, []);

  return <div></div>;
};
export default Judge;

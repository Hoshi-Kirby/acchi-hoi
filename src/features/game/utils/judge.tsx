import React, { useEffect } from "react";
import { useGameStore } from "../../../zustand";
export const Judge: React.FC = () => {
  type Direction = "up" | "down" | "left" | "right" | "center" | null;

  const currentDirections: Direction[] = useGameStore(
    (state) => state.currentDirections,
  );
  const playerDirections: Direction[] = useGameStore(
    (state) => state.playerDirections,
  );
  const isPointSystem: boolean = useGameStore((state) => state.isPointSystem);
  const increaseScore = useGameStore((state) => state.increaseScore);
  const decleaseLife = useGameStore((state) => state.decreaseLife);
  const scores: number[] = useGameStore((state) => state.scores);
  useEffect(() => {
    let counter: number = 0;
    for (let i = 0; i < playerDirections.length; i++) {
      for (const element2 of currentDirections) {
        if (playerDirections[i] === element2) break;
        counter = counter + 1;
      }
      if (counter === currentDirections.length) {
        increaseScore(i);
      } else {
        if (!isPointSystem) {
          decleaseLife(i);
        }
      }
    }
    console.log(scores);
  }, []);

  return <h1>hello</h1>;
};

export default Judge;

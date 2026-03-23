//矢印表示、共有変数に現在の矢印の向きを保存
//もらえる引数...round
//数と方向を決める⇒currentDirections[]、0,1,2,3(nullも)に入れる=>returnまで
import { useEffect } from "react";
import { useGameStore } from "../../../zustand";

export const useGameLoop = () => {
  const round = useGameStore((state) => state.round);
  const setCurrentDirections = useGameStore(
    (state) => state.setCurrentDirections,
  );
  // const increaseRound = useGameStore((state) => state.increaseRound);
  // const decreaseRound = useGameStore((state) => state.decreaseRound);
  // const setRound = useGameStore((state) => state.setRound);

  useEffect(() => {
    let numberOfArrows: number;

    const directions = ["up", "down", "left", "right"] as const; //
    //type Direction = (typeof directions)[number]; //

    if (round <= 2) {
      numberOfArrows = 1;
    } else if (round <= 6) {
      numberOfArrows = 2;
    } else {
      numberOfArrows = 3;
    }

    //up,down,left,rightの並びをシャッフルした配列を返す(後から上からnumberOfArrows個を選んで抜き取る)
    function shuffle<T>(array: T[]): T[] {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    }

    const shuffled = shuffle([...directions]);
    const selectedDirections = shuffled.slice(0, numberOfArrows);
    //
    const nulls = Array(4 - numberOfArrows).fill(null);

    let combined = [...selectedDirections, ...nulls];

    if (10 < round && round <= 12) {
      combined = [...selectedDirections, selectedDirections[0]];
    }
    if (12 < round && round <= 14) {
      combined = [
        ...selectedDirections,
        selectedDirections[0],
        selectedDirections[1],
        ...nulls,
        ...nulls,
        ...nulls,
      ];
    }
    if (14 < round) {
      combined = [
        ...selectedDirections,
        selectedDirections[0],
        ...selectedDirections,
        selectedDirections[1],
      ];
    }

    const currentDirections = shuffle(combined);
    setCurrentDirections(0, currentDirections[0]);
    setCurrentDirections(1, currentDirections[1]);
    setCurrentDirections(2, currentDirections[2]);
    setCurrentDirections(3, currentDirections[3]);
    setCurrentDirections(4, currentDirections[4]);
    setCurrentDirections(5, currentDirections[5]);
    setCurrentDirections(6, currentDirections[6]);
    setCurrentDirections(7, currentDirections[7]);

    console.log("currentDirections", currentDirections);
  }, [round]);
};

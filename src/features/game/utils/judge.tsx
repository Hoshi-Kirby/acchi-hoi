import React, { useEffect } from "react";
// import {GameState} from "../../../zzz_globalVar"
export const Judge: React.FC = () => {
  type Direction = "up" | "down" | "left" | "right" | "center" | null;

  const currentDirections: Direction[] = ["right", "center", "up", "down"]; //仮データ
  const playerDirections: Direction[] = ["right", "right", "down", "up"];
  const isPointSystem: boolean = true;

  useEffect(() => {
    let counter: number = 0;
    for (const element of playerDirections) {
      for (const element2 of currentDirections) {
        if (element === element2) break;
        counter = counter + 1;
      }
      if (counter === currentDirections.length) {
        //プレイヤーのポイント増加++
      } else {
        if (!isPointSystem) {
          //プレイヤーの残機--
        }
      }
    }
  }, []);

  return <div></div>;
};

export default Judge;

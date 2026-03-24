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

  useEffect(() => {
    if (phase === "waiting") {
      setToken([true, true, true, true]);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "arrow") {
      for (let i = 0; i < playerCount; i++) {
        if (token[i] && cameraDirections[i] !== "center" /*無？*/) {
          setplayerDirections(i, cameraDirections[i]);
        }
      }
    }
    else{
        for(let i=0;i<playerCount;i++){
            if(cameraDirections[i]!==){
                setplayerDirections(i,cameraDirections[i])
            }
        }
    }
  });
};

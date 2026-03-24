import { useEffect } from "react";
import { useGameStore } from "../../../zustand";
import type { Direction } from "../../../zustand";

// ヘルパー関数: フックの外に出すか、useCallbackでラップするのが一般的です
const set_all = (
  setPlayerDirections: (index: number, value: Direction) => void,
  value: Direction,
) => {
  // プレイヤーが4人の場合、0, 1, 2, 3 をループ
  for (let i = 0; i < 4; i++) {
    setPlayerDirections(i, value);
  }
};

export const useInterface = () => {
  const setPlayerDirections = useGameStore(
    (state) => state.setPlayerDirections,
  );
  // const round = useGameStore((state) => state.round);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          set_all(setPlayerDirections, "down");
          console.log("down");
          break;
        case "ArrowUp":
          set_all(setPlayerDirections, "up");
          console.log("up");
          break;
        case "ArrowRight":
          set_all(setPlayerDirections, "right");
          console.log("right");
          break;
        case "ArrowLeft":
          set_all(setPlayerDirections, "left");
          console.log("left");
          break;
      }
    };

    // イベントリスナーを登録
    window.addEventListener("keydown", handleKeyDown);
    console.log("イベントリスナー設置");

    // クリーンアップ関数（コンポーネントが消える時にリスナーを削除）
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      console.log("イベントリスナー撤去");
    };
  }, [setPlayerDirections]); // 依存配列にセット関数を含める

  // useEffect(() => {
  // set_all(setPlayerDirections, "center");
  // console.log("center");
  // }, [round, setPlayerDirections]);
};

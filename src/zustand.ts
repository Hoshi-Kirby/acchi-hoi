import { create } from "zustand";

export type Direction = "up" | "down" | "left" | "right" | "center" | null;
export type phase = "arrow" | "waiting" | "judging";
export type Success = "success" | "fail" | null;

type gameState = {
  playerCount: number;
  round: number; //ラウンド
  showingCharacter: boolean;
  isPointSystem: boolean;
  isTimeAtack: boolean;
  isMaleCharacter: boolean[];
  scores: number[]; //ポイント
  lives: number[]; //残機
  timeScore: number; //ポイント
  currentDirections: Direction[];
  playerDirections: Direction[];
  timer: number;
  phase: phase;
  cameraDirections: Direction[];
  token: boolean[];
  highScore: number;
  calibration_timer: number;
  highScore2: number;
  resultEffect: Success[];
  isClear: boolean[];
  isOpen: boolean[];
  hasAchieved: boolean;
  up_standard: number[];
  down_standard: number[];
  uid: string;
  increasePlayerCount: () => void;
  decreasePlayerCount: () => void;
  setPlayerCount: (c: number) => void;
  increaseRound: () => void;
  decreaseRound: () => void;
  setRound: (c: number) => void;
  setShowingCharacter: (c: boolean) => void;
  setIsPointSystem: (c: boolean) => void;
  setIsTimeAtack: (c: boolean) => void;
  setIsMaleCharacter: (index: number, value: boolean) => void;
  increaseScore: (index: number) => void;
  decreaseScore: (index: number) => void;
  setScore: (index: number, value: number) => void;
  setTimeScore: (value: number) => void;
  increaseLife: (index: number) => void;
  decreaseLife: (index: number) => void;
  setLife: (index: number, value: number) => void;
  setCurrentDirections: (index: number, value: Direction) => void;
  setPlayerDirections: (index: number, value: Direction) => void;
  setTimer: (index: number) => void;
  setPhase: (c: phase) => void;
  setCameraDirections: (index: number, value: Direction) => void;
  deleteToken: () => void;
  setHighScore: (index: number) => void;
  setCalibration_timer: (c: number) => void;
  increaseCalibration_timer: () => void;
  setHighScore2: (index: number) => void;
  setResultEffect: (index: number, value: Success) => void;
  setIsClear: (index: number, value: boolean) => void;
  setIsOpen: (index: number, value: boolean) => void;
  resetIsClear: () => void;
  resetIsOpen: () => void;
  setHasAchieved: (c: boolean) => void;
  setUp_standard: (index: number, pitch: number) => void;
  setDown_standard: (index: number, pitch: number) => void;
  setUid: (uid: string) => void;
};

export const useGameStore = create<gameState>((set) => ({
  // プレイヤー人数
  playerCount: 1,
  increasePlayerCount: () =>
    set((state) => ({ playerCount: state.playerCount + 1 })), //変数に+1
  decreasePlayerCount: () =>
    set((state) => ({ playerCount: state.playerCount - 1 })), //変数に-1
  setPlayerCount: (c: number) => set({ playerCount: c }), //変数に代入

  // プレイヤー人数
  round: 1,
  increaseRound: () => set((state) => ({ round: state.round + 1 })), //変数に+1
  decreaseRound: () => set((state) => ({ round: state.round - 1 })), //変数に-1
  setRound: (c: number) => set({ round: c }), //変数に代入

  // キャラクターを画面に表示するか否か
  showingCharacter: true,
  setShowingCharacter: (c: boolean) => set({ showingCharacter: c }),

  // ポイント制か否か
  isPointSystem: true,
  setIsPointSystem: (c: boolean) => set({ isPointSystem: c }),

  // TA
  isTimeAtack: false,
  setIsTimeAtack: (c: boolean) => set({ isTimeAtack: c }),

  // 性別
  isMaleCharacter: [true, true, true, true],
  setIsMaleCharacter: (index: number, value: boolean) =>
    set((state) => ({
      isMaleCharacter: state.isMaleCharacter.map((s, i) =>
        i === index ? value : s,
      ),
    })),

  //  スコア
  scores: [0, 0, 0, 0],
  increaseScore: (index: number) =>
    set((state) => ({
      scores: state.scores.map((s, i) => (i === index ? s + 1 : s)),
    })),
  decreaseScore: (index: number) =>
    set((state) => ({
      scores: state.scores.map((s, i) => (i === index ? s - 1 : s)),
    })),
  setScore: (index: number, value: number) =>
    set((state) => ({
      scores: state.scores.map((s, i) => (i === index ? value : s)),
    })),

  timeScore: 0,
  setTimeScore: (c: number) => set({ timeScore: c }),

  // 残機
  lives: [3, 3, 3, 3],
  increaseLife: (index: number) =>
    set((state) => ({
      lives: state.lives.map((l, i) => (i === index ? l + 1 : l)),
    })),
  decreaseLife: (index: number) =>
    set((state) => ({
      lives: state.lives.map((l, i) => (i === index ? l - 1 : l)),
    })),
  setLife: (index: number, value: number) =>
    set((state) => ({
      lives: state.lives.map((l, i) => (i === index ? value : l)),
    })),

  currentDirections: [
    "center",
    "center",
    "center",
    "center",
    "center",
    "center",
    "center",
    "center",
  ],
  setCurrentDirections: (index: number, value: Direction) =>
    set((state) => ({
      currentDirections: state.currentDirections.map((l, i) =>
        i === index ? value : l,
      ),
    })),
  playerDirections: ["center", "center", "center", "center"],
  setPlayerDirections: (index: number, value: Direction) =>
    set((state) => ({
      playerDirections: state.playerDirections.map((l, i) =>
        i === index ? value : l,
      ),
    })),
  timer: 0,
  setTimer: (c: number) => set({ timer: c }),

  phase: "waiting",
  setPhase: (c: phase) => set({ phase: c }),
  cameraDirections: ["center", "center", "center", "center"],
  setCameraDirections: (index: number, value: Direction) =>
    set((state) => ({
      cameraDirections: state.cameraDirections.map((l, i) =>
        i === index ? value : l,
      ),
    })),

  token: [true, true, true, true],
  deleteToken: () => set({ token: [false, false, false, false] }),
  highScore: 0,
  setHighScore: (c: number) => set({ highScore: c }),

  calibration_timer: 0,
  setCalibration_timer: (c: number) => set({ calibration_timer: c }),
  increaseCalibration_timer: () =>
    set((state) => ({ calibration_timer: state.calibration_timer + 1 })),
  highScore2: 99990,
  setHighScore2: (c: number) => set({ highScore2: c }),

  // ジャッジの判定
  resultEffect: [null, null, null, null],
  setResultEffect: (index: number, value: Success) =>
    set((state) => ({
      resultEffect: state.resultEffect.map((l, i) => (i === index ? value : l)),
    })),
  isClear: [false, false, false, false, false, false, false, false, false],
  isOpen: [false, false, false, false, false, false, false, false, false],
  setIsClear: (index: number, value: boolean) =>
    set((state) => ({
      isClear: state.isClear.map((l, i) => (i === index ? value : l)),
    })),
  setIsOpen: (index: number, value: boolean) =>
    set((state) => ({
      isOpen: state.isOpen.map((l, i) => (i === index ? value : l)),
    })),
  resetIsClear: () => set({ isClear: Array(9).fill(false) }),
  resetIsOpen: () => set({ isOpen: Array(9).fill(false) }),
  hasAchieved: false,
  setHasAchieved: (c: boolean) => set({ hasAchieved: c }),

  up_standard: [0.4, 0.4, 0.4, 0.4],
  down_standard: [0.4, 0.4, 0.4, 0.4],
  setUp_standard: (index: number, pitch: number) =>
    set((state) => ({
      up_standard: state.up_standard.map((l, i) => (i === index ? pitch : l)),
    })),
  setDown_standard: (index: number, pitch: number) =>
    set((state) => ({
      down_standard: state.down_standard.map((l, i) =>
        i === index ? pitch : l,
      ),
    })),

  uid: "",
  setUid: (uid: string) => set({ uid: uid }),
}));

// まだやって無ければターミナルでnpm install zustandを実行する。

// それぞれのファイルで変数を使用する方法

//import { useGameStore } from "../zustand";  ←この参照先は使用するファイルの階層によって変わる

//でuseGameStoreをimportして、

//   const playerCount = useGameStore((state) => state.playerCount);
//   const increasePlayerCount = useGameStore((state) => state.increasePlayerCount);
//   const decreasePlayerCount = useGameStore((state) => state.decreasePlayerCount);
//   const setPlayerCount = useGameStore((state) => state.setPlayerCount);

// これでその変数(今回はplayerCount)をplayerCountに代入する。
// 値を代入するときは、setPlayerCount(10)のように書く。(この例は10を代入する。)
// 値を1増やすときは、increasePlayerCount()減らすときは、decreasePlayerCount()をつかう。

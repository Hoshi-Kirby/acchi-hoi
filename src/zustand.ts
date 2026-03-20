import { create } from "zustand";

type gameState = {
  playerCount: number;
  showingCharacter: boolean;
  isPointSystem: boolean;
  isMaleCharacter: boolean[];
  scores: number[]; //ポイント
  lives: number[]; //残機
  increasePlayerCount: () => void;
  decreasePlayerCount: () => void;
  setPlayerCount: (c: number) => void;
  setShowingCharacter: (c: boolean) => void;
  setIsPointSystem: (c: boolean) => void;
  setIsMaleCharacter: (index: number, value: boolean) => void;
  increaseScore: (index: number) => void;
  decreaseScore: (index: number) => void;
  setScore: (index: number, value: number) => void;
  increaseLife: (index: number) => void;
  decreaseLife: (index: number) => void;
  setLife: (index: number, value: number) => void;
};

export const useGameStore = create<gameState>((set) => ({
  // プレイヤー人数
  playerCount: 1,
  increasePlayerCount: () =>
    set((state) => ({ playerCount: state.playerCount + 1 })), //変数に+1
  decreasePlayerCount: () =>
    set((state) => ({ playerCount: state.playerCount - 1 })), //変数に-1
  setPlayerCount: (c: number) => set({ playerCount: c }), //変数に代入

  // キャラクターを画面に表示するか否か
  showingCharacter: true,
  setShowingCharacter: (c: boolean) => set({ showingCharacter: c }),

  // ポイント制か否か
  isPointSystem: true,
  setIsPointSystem: (c: boolean) => set({ isPointSystem: c }),

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
}));

// まだやって無ければターミナルで　npm install zustand　を実行する。

// それぞれのファイルで変数を使用する方法

//import { useGameStore } from "../zustand";　  ←この参照先は使用するファイルの階層によって変わる

//でuseGameStoreをimportして、

//   const playerCount = useGameStore((state) => state.playerCount);
//   const increasePlayerCount = useGameStore((state) => state.increasePlayerCount);
//   const decreasePlayerCount = useGameStore((state) => state.decreasePlayerCount);
//   const setPlayerCount = useGameStore((state) => state.setPlayerCount);

// これでその変数(今回はplayerCount)をplayerCountに代入する。
// 値を代入するときは、setPlayerCount(10)　のように書く。(この例は10を代入する。)
// 値を1増やすときは、increasePlayerCount()　1減らすときは、decreasePlayerCount()　をつかう。

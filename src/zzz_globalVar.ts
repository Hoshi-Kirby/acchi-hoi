export type PlayerDirection = "up" | "down" | "left" | "right" | "center";
export type ArrowDirection = "up" | "down" | "left" | "right";

export type GamePhase =
  | "title" //タイトル
  | "option" //オプション
  | "calibration" //キャリブレーション
  | "arrowShowing" //矢印表示
  | "judging" //キャプチャと判定
  | "roundResult" //正誤・スコア
  | "paused" //メニュー
  | "finished"; //結果

export interface GameState {
  //設定
  showingCharacter: boolean; //キャラ表示か
  isMaleCharacter: boolean; //男性キャラか
  playerCount: number; //人数
  isPointSystem: boolean; //ポイント制か

  //進行
  round: number;
  phase: GamePhase;

  //プレイヤー状態(配列)
  scores: number[]; //ポイント
  lives: number[]; //残機

  //ゲーム
  currentDirections: ArrowDirection[]; //矢印の方向
  playerDirections: PlayerDirection[]; //顔の向き

  //結果
  highScore: number;

  //関数
  setSettings: (settings: Partial<GameState>) => void; //設定の更新
  setPhase: (phase: GamePhase) => void; //フェーズ進行
  updateHighScore: (score: number) => void;
  resetGame: () => void; //再戦時リセット
}

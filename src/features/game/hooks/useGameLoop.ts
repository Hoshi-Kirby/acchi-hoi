//矢印表示、共有変数に現在の矢印の向きを保存
//もらえる引数...round
//数と方向を決める⇒currentDirections[]、0,1,2,3(nullも)に入れる=>returnまで

//矢印の数numberOfArrowsを定義(あとでなくせるからなくしてもいい)
let numberOfArrows: number;
let round: number = 1; //

const directions = ["up", "down", "left", "right"] as const; //
type Direction = (typeof directions)[number]; //

if (round <= 2) {
  numberOfArrows = 1;
} else if (round <= 6) {
  numberOfArrows = 2;
} else {
  //round>=7はすべて3
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

const combined = [...selectedDirections, ...nulls];

const currentDirections = shuffle(combined);

console.log("currentDirections", currentDirections);

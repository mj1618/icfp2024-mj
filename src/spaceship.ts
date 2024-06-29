import { distance, sendToServer } from "./util";
const fs = require("fs");
const MOVE = {
  1: [-1, -1],
  2: [0, -1],
  3: [1, -1],

  4: [-1, 0],
  5: [0, 0],
  6: [1, 0],

  7: [-1, 1],
  8: [0, 1],
  9: [1, 1],
};

const MOVE_STR = {
  1: "DL",
  2: "D",
  3: "DR",

  4: "L",
  5: "S",
  6: "R",

  7: "UL",
  8: "U",
  9: "UR",
};

const MOVE_STR_INV = {
  DL: 1,
  D: 2,
  DR: 3,

  L: 4,
  S: 5,
  R: 6,

  UL: 7,
  U: 8,
  UR: 9,
};

let seqCache: { [key: number]: number[] } = {};

export const getSequence = (target: number) => {
  if (seqCache[target] !== undefined) {
    return seqCache[target];
  }
  let n = Math.floor(Math.sqrt(target));

  let remainder = target - Math.pow(n, 2);

  let mults: number[][] = [];

  if (remainder >= n) {
    let factor = Math.floor(remainder / n);
    mults.push([n, factor]);
    remainder -= n * factor;
  }
  if (remainder > 0) {
    mults.push([remainder, 1]);
    remainder = 0;
  }

  let res: number[] = [];

  for (let i = 1; i <= n; i++) {
    res.push(1);
    for (let j = 0; j < mults.length; j++) {
      if (mults[j][0] === i) {
        for (let k = 0; k < mults[j][1]; k++) {
          res.push(0);
        }
      }
    }
  }
  for (let i = 1; i <= n; i++) {
    res.push(-1);
  }
  seqCache[target] = res;
  return res;
};

export const solveSpaceship = async (n: number) => {
  let temp = (await sendToServer(`get spaceship${n}`)).value as string;

  let curr = [0, 0];
  let vx = 0;
  let vy = 0;

  console.log(temp);

  let toVisit = temp.split("\n").map((row) => row.split(" ").map(Number));
  toVisit = toVisit.slice(0, toVisit.length - 1);
  let moves = [];

  while (toVisit.length > 0) {
    toVisit.sort((a, b) => {
      return distance(curr, a) - distance(curr, b);
    });

    const next = toVisit.shift();

    let dx = next![0] - curr[0];
    let dy = next![1] - curr[1];

    const xdist = getSequence(Math.abs(dx));
    const ydist = getSequence(Math.abs(dy));

    for (let i = 0; i < Math.max(ydist.length, xdist.length); i++) {
      let xmove = i < xdist.length ? xdist[i] : 0;
      let ymove = i < ydist.length ? ydist[i] : 0;

      if (dx < 0) {
        xmove *= -1;
      }
      if (dy < 0) {
        ymove *= -1;
      }

      let move = -1;
      if (xmove === -1 && ymove === -1) {
        move = MOVE_STR_INV.DL;
      } else if (xmove === 0 && ymove === -1) {
        move = MOVE_STR_INV.D;
      } else if (xmove === 1 && ymove === -1) {
        move = MOVE_STR_INV.DR;
      } else if (xmove === -1 && ymove === 0) {
        move = MOVE_STR_INV.L;
      } else if (xmove === 0 && ymove === 0) {
        move = MOVE_STR_INV.S;
      } else if (xmove === 1 && ymove === 0) {
        move = MOVE_STR_INV.R;
      } else if (xmove === -1 && ymove === 1) {
        move = MOVE_STR_INV.UL;
      } else if (xmove === 0 && ymove === 1) {
        move = MOVE_STR_INV.U;
      } else if (xmove === 1 && ymove === 1) {
        move = MOVE_STR_INV.UR;
      }
      moves.push(move);
      vx += MOVE[move as keyof typeof MOVE_STR][0];
      vy += MOVE[move as keyof typeof MOVE_STR][1];
      curr[0] += vx;
      curr[1] += vy;

      for (let i = 0; i < toVisit.length; i++) {
        if (toVisit[i][0] === curr[0] && toVisit[i][1] === curr[1]) {
          toVisit.splice(i, 1);
          break;
        }
      }
    }
  }
  console.log(moves.map((m) => MOVE_STR[m as keyof typeof MOVE_STR]).join(""));

  fs.writeFileSync(
    `./soln/spaceship/${n}.txt`,
    moves.join("") +
      "\n\n" +
      moves.map((m) => MOVE_STR[m as keyof typeof MOVE_STR]).join("")
  );

  await sendToServer(`solve spaceship${n} ${moves.join("")}`);
};

import { sendToServer } from "./util";

const readline = require("readline");

const test1 = `
. . . . 0 . . . .
. A > . = . . . .
. v 1 . . > . . .
. . - . . . + S .
. . . . . ^ . . .
. . v . . 1 > . .
. . . . . . A * .
. 1 @ 6 . . < . .
. . 3 . 0 @ 3 . .
. . . . . 3 . . .`;

const mult = `
. . . . 0 . . . .
. B > . = . . . .
. v 1 . . > . . .
. . - . . . + S .
. . . . . ^ . . .
. . v . . 0 > . .
. . . . . . A + .
. 1 @ 6 . . < . .
. . 3 . 0 @ 3 . .
. . . . . 3 . . .`;

const fact = `
. . . . 0 . . . . . . . . .
. A > . = . . . . . . A > .
. v 1 . . > . . . . . v 1 .
. . - . . . + S . . < . - .
. . . . . ^ . . . v . . . .
. . v . . . > 1 < . . . v .
. . . . . . A * . . . . . .
. . v . . . . . . . . . v .
. . . . . . . v . . . . . .
. 1 @ 6 . . < . . . . 1 @ 6
. . 4 . -1 @ 4 . . . . . 4 .
. . . . . 4 . . . . . . . .
. . . . . . . . . . . . . .`;

export const solve3d = async () => {
  const merged = fact
    .split("\n")
    .filter((row) => row.length > 0)
    .join("\n");

  console.log(merged);
  console.log((await sendToServer(`solve 3d1\n${merged}`)).value);
};

// test3d();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const operate = (cell: string, x: number, y: number) => {
  switch (cell) {
    case `+`:
      return x + y;
    case `-`:
      return x - y;
    case `*`:
      return x * y;
    case `/`:
      return Math.floor(x / y);
    case `%`:
      return x % y;
  }
};

const simulate = async (source: string, a = 0, b = 0) => {
  const merged = source
    .split("\n")
    .filter((row) => row.length > 0)
    .join("\n");
  const gridOriginal = merged.split("\n").map((row) => row.split(" "));
  const nrows = merged.split("\n").length;
  const ncols = merged.split("\n")[0].split(" ").length;
  const unary = [`<`, `>`, `^`, `v`];
  const binary = [`+`, `-`, `*`, `/`, `%`, `=`, `#`];
  const quaternary = [`@`];
  const identifier = [`S`, `A`, `B`];

  const isSafe = (r: number, c: number) => {
    return r >= 0 && r < nrows && c >= 0 && c < ncols;
  };
  const isAllSafe = (ls: [number, number][]) => {
    return ls.every(([r, c]) => isSafe(r, c));
  };

  for (let r = 0; r < nrows; r++) {
    for (let c = 0; c < ncols; c++) {
      if (gridOriginal[r][c] === `A`) {
        gridOriginal[r][c] = `${a}`;
      }
      if (gridOriginal[r][c] === `B`) {
        gridOriginal[r][c] = `${b}`;
      }
    }
  }
  let time = [gridOriginal];

  while (true) {
    const grid = time[time.length - 1];
    console.log(grid.map((row) => row.join("   ")).join("\n"));
    console.log("----");
    // await new Promise((r) => setTimeout(r, 500));
    await new Promise((r) => rl.question("Press enter", r));
    const newGrid = grid.map((row) => row.slice());

    let newTimePieces = [];
    let timeTravel = -1;
    let slocation = [-1, -1];
    for (let r = 0; r < nrows; r++) {
      for (let c = 0; c < ncols; c++) {
        if (grid[r][c] === `S`) {
          slocation = [r, c];
        }
      }
    }

    let toClear = [];
    let toWrite = [];

    for (let r = 0; r < nrows; r++) {
      for (let c = 0; c < ncols; c++) {
        const cell = grid[r][c];
        if (unary.includes(cell)) {
          switch (cell) {
            case `<`:
              if (
                isAllSafe([
                  [r, c - 1],
                  [r, c + 1],
                ]) &&
                !isNaN(parseInt(grid[r][c + 1]))
              ) {
                // newGrid[r][c - 1] = grid[r][c + 1];
                toWrite.push([r, c - 1, grid[r][c + 1]]);
                toClear.push([r, c + 1]);
              }
              break;
            case `>`:
              if (
                isAllSafe([
                  [r, c - 1],
                  [r, c + 1],
                ]) &&
                !isNaN(parseInt(grid[r][c - 1]))
              ) {
                // console.log("shifting", r, c, grid[r][c - 1]);
                // newGrid[r][c + 1] = grid[r][c - 1];
                toWrite.push([r, c + 1, grid[r][c - 1]]);
                toClear.push([r, c - 1]);
              }
              break;
            case `^`:
              if (
                isAllSafe([
                  [r + 1, c],
                  [r, c],
                ]) &&
                !isNaN(parseInt(grid[r + 1][c]))
              ) {
                //   newGrid[r - 1][c] = grid[r + 1][c];
                toWrite.push([r - 1, c, grid[r + 1][c]]);
                toClear.push([r + 1, c]);
              }
              break;
            case `v`:
              if (
                isAllSafe([
                  [r + 1, c],
                  [r, c],
                ]) &&
                !isNaN(parseInt(grid[r - 1][c]))
              ) {
                // newGrid[r + 1][c] = grid[r - 1][c];
                toWrite.push([r + 1, c, grid[r - 1][c]]);
                toClear.push([r - 1, c]);
              }
              break;
          }
        }
        if (binary.includes(cell)) {
          if (
            isAllSafe([
              [r - 1, c],
              [r + 1, c],
              [r, c - 1],
              [r, c + 1],
            ])
          ) {
            const y = parseInt(grid[r - 1][c]);
            const x = parseInt(grid[r][c - 1]);
            if (isNaN(x) || isNaN(y)) {
              continue;
            }

            switch (cell) {
              case `+`:
              case `-`:
              case `*`:
              case `/`:
              case `%`:
                toWrite.push([r + 1, c, "" + operate(cell, x, y)]);
                toWrite.push([r, c + 1, "" + operate(cell, x, y)]);
                toClear.push([r - 1, c]);
                toClear.push([r, c - 1]);
                break;
              case `=`:
                if (x === y) {
                  toWrite.push([r + 1, c, "" + x]);
                  toWrite.push([r, c + 1, "" + x]);
                  toClear.push([r - 1, c]);
                  toClear.push([r, c - 1]);
                }
                break;
              case `#`:
                if (x === y) {
                  toWrite.push([r + 1, c, "" + x]);
                  toWrite.push([r, c + 1, "" + y]);
                  toClear.push([r - 1, c]);
                  toClear.push([r, c - 1]);
                }
                break;
            }
          }
        }
        if (cell === "@") {
          const dx = parseInt(grid[r][c - 1]);
          const dy = parseInt(grid[r][c + 1]);
          const dt = parseInt(grid[r + 1][c]);
          const x = parseInt(grid[r - 1][c]);
          if (isNaN(dx) || isNaN(dy) || isNaN(dt) || isNaN(x)) {
            continue;
          }
          if (isAllSafe([[r - dy, c - dx]])) {
            newTimePieces.push([r - dy, c - dx, "" + x, dt]);
            if (timeTravel !== -1 && dt != timeTravel) {
              throw new Error("mismatch dt " + timeTravel + " " + dt);
            }
            timeTravel = dt;
          }
        }
      }
    }

    for (let i = 0; i < toWrite.length; i++) {
      const [r, c, x]: any = toWrite[i];
      if (grid[r][c] === "S") {
        console.log("result", x);
        return x;
      }
    }

    if (timeTravel > 0) {
      const newGrid = time[time.length - timeTravel - 1];
      time = time.slice(0, time.length - timeTravel);
      for (let i = 0; i < newTimePieces.length; i++) {
        const [r, c, x, dt]: any[] = newTimePieces[i];
        newGrid[r][c] = x;
      }
      time.push(newGrid);
    } else {
      for (let i = 0; i < toClear.length; i++) {
        const [r, c] = toClear[i];
        newGrid[r][c] = ".";
      }
      for (let i = 0; i < toWrite.length; i++) {
        const [r, c, x]: any = toWrite[i];
        newGrid[r][c] = x;
      }
      time.push(newGrid);
    }
    if (newGrid[slocation[0]][slocation[1]] !== "S") {
      console.log("result", newGrid[slocation[0]][slocation[1]]);
      return newGrid[slocation[0]][slocation[1]];
    }
  }
};

simulate(fact, 3, 5);

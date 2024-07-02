import assert = require("node:assert");
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

const abs = `
.	1	.	A	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.
-1	+	.	=	.	>	.	>	.	>	.	.	.	.	.	.	.	.	.	.
.	.	v	.	.	A	.	.	^	0	+	S	.	.	.	.	.	.	.	.
.	.	.	.	-1	*	.	.	.	.	.	.	.	.	.	.	.	.	.	.
.	.	v	.	.	.	.	.	^	.	.	.	.	.	.	.	.	.	.	.
.	.	.	.	.	v	.	.	.	.	.	.	.	.	.	.	.	.	.	.
.	.	v	.	.	.	.	1	^	.	.	.	.	.	.	.	.	.	.	.
.	.	.	>	.	=	.	*	.	.	.	.	.	.	.	.	.	.	.	.
.	.	v	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.
.	.	.	>	.	>	.	>	.	>	.	>	.	>	.	>	.	>	.	.
.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	18	@	9
.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	13	.`;

const lcm = `
.	>	.	>	.	>	.	.	.	.	.	.
^	.	.	.	.	.	v	.	.	.	.	.
.	.	.	.	.	.	.	>	.	>	.	.
^	.	.	A	>	.	%	.	.	7	@	0
.	.	.	v	.	.	.	.	.	.	9	.
^	0	.	.	.	.	v	.	.	.	.	.
B	=	.	+	.	.	.	.	.	.	.	.
.	.	.	.	.	6	@	1	.	.	.	.
.	.	.	v	.	.	9	.	.	.	.	.
.	A	.	.	.	.	.	.	.	.	.	.
B	*	.	/	S	.	.	.	.	.	.	.
.	.	.	.	.	.	.	.	.	.	.	.`;

const gt = `
.	1	.	1	.	-1	.	A	.
99	+	.	+	.	+	.	=	S
.	.	.	.	.	.	v	B	^
.	.	.	.	.	.	.	=	.
.	.	.	.	.	.	v	.	.
.	.	.	.	.	.	.	.	.
.	.	.	.	.	2	@	5	.
.	.	.	.	.	.	3	.	.`;

const prime = `
.	.	1	.	A	.	A	.
.	1	+	.	=	.	/	S
.	.	.	.	.	.	.	.
.	.	v	.	.	.	.	.
.	<	.	.	0	.	.	.
v	A	%	.	=	S	.	.
.	.	.	.	.	.	.	.
v	.	.	.	.	.	.	.
.	.	.		.	.	.	.
v	.	.	.	.	.	.	.
.	>	.	.	.	.	.	.
.	1	@	10	.	.	.	.
.	.	7	.	.	.	.	.`;

const palindrome = `
.	.	.	.	.	.	.	.	10	.	.	.	.	.	.	.	.	.	.	.	.	.	.
.	.	.	.	>	.	>	.	/	.	>	.	>	.	>	.	>	.	>	.	>	.	.
.	.	.	^	.	.	10	.	.	.	.	.	.	.	.	.	.	.	.	.	.	v	.
.	.	<	A	>	.	%	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.
0	=	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	18	@	1
.	.	.	.	.	0	+	.	>	.	>	.	>	.	.	.	.	.	.	.	.	11	.
.	#	.	.	.	.	.	.	A	.	A	.	.	v	.	.	.	.	.	.	.	.	.
^	.	>	.	>	.	>	.	=	.	/	S	.	.	.	.	.	.	.	.	.	.	.
.	<	.	<	0	.	.	v	.	.	.	.	.	v	.	.	.	.	.	.	.	.	.
.	.	.	.	v	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.
.	.	.	.	.	.	0	*	.	>	.	>	S	v	.	.	.	.	.	.	.	.	.
.	.	.	10	*	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.
.	.	.	.	.	>	.	>	.	>	.	>	.	+	.	>	.	.	.	.	.	.	.
.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	12	@	5	.	.	.	.	.
.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	.	11	.	.	.	.	.	.`;

export const solve3d = async (source: string, n: number) => {
  const merged = source
    .replaceAll("\t", " ")
    .split("\n")
    .filter((row) => row.length > 0)
    .join("\n");
  console.log("answer: ");
  console.log(merged);
  console.log("result:");
  console.log((await sendToServer(`solve 3d${n}\n${merged}`)).value);
};

export const test3d = async (source: string) => {
  const merged = source
    .replaceAll("\t", " ")
    .split("\n")
    .filter((row) => row.length > 0)
    .join("\n");
  console.log("answer: ");
  console.log(`test 3d 3 4\n${merged}`);
  console.log("result:");
  console.log((await sendToServer(`test 3d 3 4\n${merged}`)).value);
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

const simulate = async (source: string, a = 0, b = 0, pause = true) => {
  const merged = source
    .replaceAll("\t", " ")
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
    console.log(grid.map((row) => row.join(" ")).join("\n"));
    console.log("----");
    // await new Promise((r) => setTimeout(r, 500));
    if (pause) {
      await new Promise((r) => rl.question("Press enter", r));
    }

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
                if (x !== y) {
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
            console.log("checking", r, c, dx, dy, dt, x, timeTravel);
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
      for (let i = 0; i < newTimePieces.length; i++) {
        const [r, c, x, dt]: any[] = newTimePieces[i];
        console.log("writing", r, c, x, dt, time.length);
        newGrid[r][c] = x;
      }
      time = time.slice(0, time.length - timeTravel);
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
  }
};

// temp = A
// reverseNum = 0

// while (temp != 0) {
//   int digit = temp % 10;
//   reverseNum = reverseNum * 10 + digit;
//   temp = temp / 10;
// }

// const gcd = (a: number, b: number): number => {
//   if (b === 0) {
//     return a;
//   }
//   return gcd(b, a % b);
// };

// const lcm = (a: number, b: number): number => {
//   return (a * b) / gcd(a, b);
// };

// console.log(lcm(3, 7));

// solve3d(palindrome, 7);

const isPalindrome = (n: number) => {
  const str = n.toString();
  return str === str.split("").reverse().join("");
};

// (async () => {
//   for (let i = 1; i <= 9999999999; i++) {
//     assert.strictEqual(
//       parseInt(await simulate(palindrome, i, 0, false)),
//       isPalindrome(i) ? 1 : 0
//     );
//     if (i % 10000 === 0) {
//       console.log("passed", i);
//     }
//   }
// })();

// test3d(palindrome);
// solve3d(palindrome, 7);

const fact = `
.	.	.	.	.	>	.	>	.	.
.	A	.	-1	^	1	.	6	@	-1
1	+	.	+	.	=	.	.	4	.
.	.	.	.	.	.	.	.	.	.
.	.	1	*	.	*	S	.	.	.
.	.	.	.	v	.	.	.	.	.
.	.	.	.	.	>	.	.	.	.
.	.	.	.	.	4	@	3	.	.
.	.	.	.	.	.	4	.	.	.`;

const abs2 = `
.	.	.	.	.	1	.	A	.	.
.	.	.	.	-1	+	.	=	S	.
.	.	<	.	<	.	.	.	.	.
.	v	.	.	.	v	.	.	.	.
.	.	.	99	.	.	.	.	.	.
.	v	1	+	.	=	.	.	.	.
.	.	.	.	.	.	.	.	.	.
-3	@	6	.	A	#	.	.	.	.
.	5	.	.	.	.	.	.	.	.
.	.	.	.	-1	*	S	.	.	.
.	.	.	.	.	.	.	.	.	.`;

const input = `2 x 1
  11 x 1
  101 x 1
  110 x 0
  123454321 x 1
  1896618966 x 0
  5619229165 x 1
  3801638016 x 0
  2784334872 x 1
  6136336316 x 1
  8245995428 x 1
  3093530935 x 0
  5374554735 x 1
  9183691836 x 0
  9190660919 x 1
  3085225803 x 1
  9152332519 x 1
  1516015160 x 0
  8077480774 x 0
  9405775049 x 1
  5023113205 x 1
  6274224726 x 1
  3950330593 x 1
  6768008676 x 1
  9343333439 x 1`;

const numbers = input.split("\n").map((line) => {
  const [num, result] = line.split("x").map((str) => str.trim());
  return { num: parseInt(num), result: parseInt(result) };
});

console.log(numbers);
// (async () => {
//   for (let i = 0; i < numbers.length; i++) {
//     // console.log(numbers[i].num, isPalindrome(numbers[i].num) ? 1 : 0, numbers[i].result);
//     assert.strictEqual(
//       parseInt(await simulate(palindrome, numbers[i].num, 2, false)),
//       numbers[i].result,
//       `failed at ${numbers[i].num}`
//     );
//   }
// })();

// simulate(abs2, -5, 7, false);
simulate(palindrome, 2, 2, false);
// solve3d(abs2, 2);

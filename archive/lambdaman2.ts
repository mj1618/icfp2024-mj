import { sendToServer } from "./util";
const fs = require("fs");

const loopGrid = (
  grid: string[][],
  fn: (row: number, col: number, item: string) => any
) => {
  let results = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const r = fn(row, col, grid[row][col]);
      if (r != null) {
        results.push(r);
      }
    }
  }
  return results;
};

const UP = "U",
  DOWN = "D",
  LEFT = "L",
  RIGHT = "R";

export const bfs = (grid: string[][]) => {
  const seen = new Set<string>();
  seen.add(grid.map((row) => row.join("")).join("\n"));
  let curr = loopGrid(grid, (row, col, item) =>
    item === "L" ? [row, col] : null
  )[0];

  let q = [[curr, grid, ""]];
  let minPath = "";

  while (q.length > 0) {
    const [curr, grid, path] = q.pop()!;
    if (grid.join("\n").split(".").length === 1) {
      if (minPath === "" || path.length <= minPath.length) {
        minPath = path;
        console.log("path", path);
        process.exit();
      }
      continue;
    }

    if (minPath !== "" && path.length >= minPath.length) continue;

    for (let i = 0; i < 4; i++) {
      let next = curr.slice();
      if (i === 0) {
        next[0]--;
      } else if (i === 1) {
        next[0]++;
      } else if (i === 2) {
        next[1]--;
      } else {
        next[1]++;
      }
      if (
        next[0] < 0 ||
        next[0] >= grid.length ||
        next[1] < 0 ||
        next[1] >= grid[0].length
      ) {
        continue;
      }

      if (grid[next[0]][next[1]] === "." || grid[next[0]][next[1]] === " ") {
        const newGrid = grid.map((row: any) => row.slice());

        newGrid[curr[0]][curr[1]] = " ";
        newGrid[next[0]][next[1]] = "L";
        const key = newGrid.map((row: any) => row.join("")).join("\n");
        if (!seen.has(key)) {
          seen.add(key);
          console.log(newGrid.map((row: any) => row.join("")).join("\n"));
          console.log();
          q.push([next, newGrid, path + "UDLR"[i]]);
        }
      }
    }
  }
  return minPath;
};

export const solveLambdaMan2 = async (n: number) => {
  let temp = ((await sendToServer(`get lambdaman${n}`)).value as string).split(
    "\n"
  );
  temp = temp.filter((row) => row.length > 0);
  let grid = temp.map((row) => row.split(""));
  console.log(grid);
  const path = bfs(grid);

  console.log(path);
  fs.writeFileSync(`./soln/lambdaman/${n}.txt`, path);

  console.log((await sendToServer(`solve lambdaman${n} ${path}`)).value);
};

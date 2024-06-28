import { sendToServer } from "./util";

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

export const pathSearch = (
  grid: string[][],
  start: number[],
  end: number[]
) => {
  const nrows = grid.length;
  const ncols = grid[0].length;
  const visited = Array(nrows)
    .fill(0)
    .map(() => Array(ncols).fill(false));
  const queue = [[start, ""]];

  while (queue.length > 0) {
    const el = queue.shift();
    const curr = el![0] as any;
    const path = el![1] as any;
    // console.log("popped", curr, "path", path);
    if (visited[curr[0]][curr[1]]) {
      continue;
    }

    visited[curr[0]][curr[1]] = true;

    if (curr[0] === end[0] && curr[1] === end[1]) {
      return path;
    }

    if (curr[0] > 0 && grid[curr[0] - 1][curr[1]] !== "#") {
      queue.push([[curr[0] - 1, curr[1]], path + UP]);
    }
    if (curr[0] < nrows - 1 && grid[curr[0] + 1][curr[1]] !== "#") {
      queue.push([[curr[0] + 1, curr[1]], path + DOWN]);
    }
    if (curr[1] > 0 && grid[curr[0]][curr[1] - 1] !== "#") {
      queue.push([[curr[0], curr[1] - 1], path + LEFT]);
    }
    if (curr[1] < ncols - 1 && grid[curr[0]][curr[1] + 1] !== "#") {
      queue.push([[curr[0], curr[1] + 1], path + RIGHT]);
    }
  }
  return "";
};

export const solveLambdaMan = async (n: number) => {
  let temp = ((await sendToServer(`get lambdaman${n}`)).value as string).split(
    "\n"
  );
  let grid = temp.slice(0, temp.length - 1).map((row) => row.split(""));
  const nrows = grid.length;
  const ncols = grid[0].length;
  console.log(grid.map((row) => row.join("")).join("\n"));

  let path = "";

  let npills = grid.join("\n").split(".").length - 1;
  let curr = loopGrid(grid, (row, col, item) =>
    item === "L" ? [row, col] : null
  )[0];

  while (npills > 0) {
    const pills = loopGrid(grid, (row, col, item) => {
      if (item === ".") {
        return [
          Math.pow(row - curr[0], 2) + Math.pow(col - curr[1], 2),
          row,
          col,
        ];
      } else {
        return null;
      }
    });
    pills.sort();
    const pill = pills[0].slice(1);

    const nextPath = pathSearch(grid, curr, pill);

    for (let i = 0; i < nextPath.length; i++) {
      grid[curr[0]][curr[1]] = " ";
      if (nextPath[i] === UP) {
        curr[0]--;
      } else if (nextPath[i] === DOWN) {
        curr[0]++;
      } else if (nextPath[i] === LEFT) {
        curr[1]--;
      } else if (nextPath[i] === RIGHT) {
        curr[1]++;
      }

      if (grid[curr[0]][curr[1]] === ".") {
        npills--;
      }
      grid[curr[0]][curr[1]] = "L";
    }

    path += nextPath;
    console.log(nextPath);
    console.log(grid.map((row) => row.join("")).join("\n"));
    console.log("");
  }
  console.log(path);
  await sendToServer(`solve lambdaman${n} ${path}`);
};

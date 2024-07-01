import assert = require("assert");
import { ASTValue } from "./parse";
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

export const pathSearch = (
  grid: string[][],
  start: number[],
  end: number[],
  maxPathLength = Infinity
) => {
  const nrows = grid.length;
  const ncols = grid[0].length;
  const visited = Array(nrows)
    .fill(0)
    .map(() => Array(ncols).fill(false));
  // assert.strictEqual(grid[start[0]][start[1]], "L");
  const queue = [[start, ""]];

  while (queue.length > 0) {
    const el = queue.shift();
    const curr = el![0] as any;
    const path = el![1] as any;

    if (path.length > maxPathLength) {
      return null;
    }
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
  let temp = (
    ((await sendToServer(`get lambdaman${n}`)) as ASTValue).value as string
  ).split("\n");
  temp = temp.filter((row) => row.length > 0);
  let grid = temp.map((row) => row.split(""));
  console.log(grid);
  const nrows = grid.length;
  const ncols = grid[0].length;
  // console.log(grid.map((row) => row.join("")).join("\n"));

  let path = "";

  let npills = grid.join("\n").split(".").length - 1;
  let curr = loopGrid(grid, (row, col, item) =>
    item === "L" ? [row, col] : null
  )[0];

  let orig = curr.slice();
  let prev = curr.slice();
  let counter = 0;
  while (npills > 0) {
    counter++;
    let pill: any;

    let currFind = curr.slice();

    // if (pill == null) {
    //   currFind = curr.slice();
    //   currFind[1]++;
    //   while (
    //     currFind[1] < grid[0].length &&
    //     grid[currFind[0]][currFind[1]] !== "#"
    //   ) {
    //     if (grid[currFind[0]][currFind[1]] === ".") {
    //       pill = currFind;
    //       break;
    //     }
    //     currFind[1]++;
    //   }
    // }

    // if (pill == null) {
    //   currFind[1]--;
    //   while (currFind[1] >= 0 && grid[currFind[0]][currFind[1]] !== "#") {
    //     if (grid[currFind[0]][currFind[1]] === ".") {
    //       pill = currFind;
    //       break;
    //     }
    //     currFind[1]--;
    //   }
    // }

    // if (pill == null) {
    //   currFind = curr.slice();
    //   currFind[0]++;
    //   while (
    //     currFind[0] < grid.length &&
    //     grid[currFind[0]][currFind[1]] !== "#"
    //   ) {
    //     if (grid[currFind[0]][currFind[1]] === ".") {
    //       pill = currFind;
    //       break;
    //     }
    //     currFind[0]++;
    //   }
    // }

    // if (pill == null) {
    //   currFind = curr.slice();
    //   currFind[0]--;
    //   while (currFind[0] >= 0 && grid[currFind[0]][currFind[1]] !== "#") {
    //     if (grid[currFind[0]][currFind[1]] === ".") {
    //       pill = currFind;
    //       break;
    //     }
    //     currFind[0]--;
    //   }
    // }

    if (pill == null) {
      const comparisonPoint = curr; //prev; // curr // prev
      let minLength = Infinity;

      let foundRow = null;
      // let pills = [];
      for (let row = nrows - 1; row >= 0; row--) {
        if (counter % 2 == 0) {
          for (let col = 0; col < ncols; col++) {
            if (grid[row][col] === ".") {
              pill = [row, col];
              break;
            }
          }
        } else {
          for (let col = ncols - 1; col >= 0; col--) {
            if (grid[row][col] === ".") {
              pill = [row, col];
              break;
            }
          }
        }
      }
      //   const pills = loopGrid(grid, (row, col, item) => {
      //     if (item === ".") {
      //       // let nWalls = 0;
      //       // if (row > 0 && grid[row - 1][col] === "#") {
      //       //   nWalls++;
      //       // }
      //       // if (row < nrows - 1 && grid[row + 1][col] === "#") {
      //       //   nWalls++;
      //       // }
      //       // if (col > 0 && grid[row][col - 1] === "#") {
      //       //   nWalls++;
      //       // }
      //       // if (col < ncols - 1 && grid[row][col + 1] === "#") {
      //       //   nWalls++;
      //       // }
      //       const path = pathSearch(grid, curr.slice(), [row, col], minLength);
      // minLength =
      //   path != null ? Math.min(minLength, path.length) : minLength;
      //       return [
      //         // row,
      //         // col,
      //         row,
      //         0,
      //         0,
      //         // path != null ? path.length : Infinity,
      //         // row,
      //         // Math.pow(row - comparisonPoint[0], 2) +
      //         //   Math.pow(col - comparisonPoint[1], 2),

      //         // row,
      //         // col,
      //         // row,
      //         // col,
      //         row,
      //         col,
      //       ];
      //     } else {
      //       return null;
      //     }
      //   });
      //   pills.sort();
      //   pill = pills[0].slice(3);
    }

    const nextPath = pathSearch(grid, curr, pill);
    prev = curr.slice();
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
  compress(path);
  fs.writeFileSync(`./soln/lambdaman/${n}.txt`, path);

  await sendToServer(`solve lambdaman${n} ${path}`);
};

const compress = (path: string) => {
  let n = path.length;
  for (let i = 0; i < 4; i++) {
    let curr = path[0];
    let count = 0;
    for (let j = 0; j < path.length; j++) {
      if (path[j] === curr) {
        count++;
      } else {
        if (count > 10) {
          n -= count - 12;
        }
        curr = path[j];
        count = 1;
      }
    }
  }
  // console.log("compressed", n);
};

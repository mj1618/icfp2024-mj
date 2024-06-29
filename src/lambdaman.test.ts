import test from "node:test";
import { humanStringToAlienString } from "./util";
import assert = require("assert/strict");
const util = require("util");
var bigInt = require("big-integer");
var fs = require("fs");

let dp: { [key: string]: number } = {};

const dirs = ["U", "D", "L", "R"];

let dpIndex = 1;

console.log(dp);

test("lambdaman reduce1", () => {
  const str = "UULLUUUUUUUULLDD"; //fs.readFileSync("./soln/lambdaman/14.txt", "utf-8");
  let res = "S" + humanStringToAlienString("solve ");
  let ans = 0;
  for (let i = 0; i < str.length; i += 1) {
    const input = str.slice(i, i + 1);

    switch (dirs.indexOf(input)) {
      case 0:
        break;
      case 1:
        ans += 1 << i;
        break;
      case 2:
        ans += 1 << (i + 1);
        break;
      case 3:
        ans += 1 << i;
        ans += 1 << (i + 1);
        break;
    }
  }
  console.log(ans);

  // res = resLeft + res + resRight;
  // console.log(res, ls);
  // console.log(str.length, res.length);
  // console.log(evaluate(parse(tokenize(res))));
});

// test("lambdaman reduce", () => {
//   const str = fs.readFileSync("./soln/lambdaman/14.txt", "utf-8");
//   let res = "S" + humanStringToAlienString("solve ");
//   let ls: any = [];
//   let resLeft = "";
//   let resRight = "";

//   for (let i = 0; i < 4; i++) {
//     for (let j = 0; j < 4; j++) {
//       for (let k = 0; k < 4; k++) {
//         for (let l = 0; l < 4; l++) {
//           resLeft += "L" + humanIntegerToAlienInteger(dpIndex) + " ";
//           dp[`${dirs[i]}${dirs[j]}${dirs[k]}${dirs[l]}`] = dpIndex++;
//           resRight +=
//             " S" +
//             humanStringToAlienString(
//               `${dirs[i]}${dirs[j]}${dirs[k]}${dirs[l]}`
//             );
//         }
//       }
//     }
//   }

//   for (let i = 0; i < str.length; i += 4) {
//     const input = str.slice(i, i + 4);
//     const num = dp[input];
//     res = `B. ${res} v${humanIntegerToAlienInteger(num)}`;
//   }
//   // res = "U$ I" + ls.join("");
//   res = resLeft + res + resRight;
//   console.log(res, ls);
//   console.log(str.length, res.length);
//   console.log(evaluate(parse(tokenize(res))));
// });

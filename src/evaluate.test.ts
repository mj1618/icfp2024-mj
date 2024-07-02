import test from "node:test";
import { evaluate, logAST } from "./evaluate-stack";
import { tokenize } from "./lex";
import { parse } from "./parse";
import assert = require("assert/strict");
import exp = require("constants");
const util = require("util");
const fs = require("fs");

// test("value", () => {
//   assert.strictEqual(evaluate(parse(tokenize("I/6"), 0)).value, 1337);
//   // assert.strictEqual(
//   //   evaluate(parse(tokenize("SB%,,/}Q/2,$_"), 0)).value,
//   //   "Hello World!"
//   // );
// });

// test("unary", () => {
//   assert.strictEqual(evaluate(parse(tokenize("U- I$"), 0)).value, -3);
//   assert.strictEqual(evaluate(parse(tokenize("U! T"), 0)).value, false);
//   assert.strictEqual(evaluate(parse(tokenize("U# S4%34"), 0)).value, 15818151);
//   assert.strictEqual(evaluate(parse(tokenize("U$ I4%34"), 0)).value, "test");
// });

// test("binary", () => {
//   assert.strictEqual(evaluate(parse(tokenize("B+ I# I$"), 0)).value, 5);
//   assert.strictEqual(evaluate(parse(tokenize("B- I$ I#"), 0)).value, 1);
//   assert.strictEqual(evaluate(parse(tokenize("B* I$ I#"), 0)).value, 6);
//   assert.strictEqual(evaluate(parse(tokenize("B/ U- I( I#"), 0)).value, -3);
//   assert.strictEqual(evaluate(parse(tokenize("B% U- I( I#"), 0)).value, -1);
//   assert.strictEqual(evaluate(parse(tokenize("B< I$ I#"), 0)).value, false);
//   assert.strictEqual(evaluate(parse(tokenize("B> I$ I#"), 0)).value, true);
//   assert.strictEqual(evaluate(parse(tokenize("B= I$ I#"), 0)).value, false);
//   assert.strictEqual(evaluate(parse(tokenize("B| T F"), 0)).value, true);
//   assert.strictEqual(evaluate(parse(tokenize("B& T F"), 0)).value, false);
//   assert.strictEqual(evaluate(parse(tokenize("B. S4% S34"), 0)).value, "test");
//   assert.strictEqual(evaluate(parse(tokenize("BT I$ S4%34"), 0)).value, "tes");
//   assert.strictEqual(evaluate(parse(tokenize("BD I$ S4%34"), 0)).value, "t");
// });

// test("if", () => {
//   assert.strictEqual(
//     evaluate(parse(tokenize("? B> I# I$ S9%3 S./"), 0)).value,
//     "no"
//   );
// });

// test("lambda", () => {
//   // console.log(
//   //   util.inspect(parse(tokenize("B$ B$ L# L$ v# B. SB%,,/ S}Q/2,$_ IK")), {
//   //     showHidden: false,
//   //     depth: null,
//   //     colors: true,
//   //   })
//   // );

//   // assert.strictEqual(
//   //   evaluate(parse(tokenize("B$ B$ L# L$ v# B. SB%,,/ S}Q/2,$_ IK"))).value,
//   //   "Hello World!"
//   // );

//   assert.strictEqual(
//     evaluate(parse(tokenize(`B$ L# B$ L" B+ v" v" B* I$ I# v8`))).value,
//     evaluate(parse(tokenize(`I-`))).value
//   );

//   // assert.strictEqual(
//   //   evaluate(parse(tokenize(`B+ I' B* I$ I#`))).value,
//   //   evaluate(parse(tokenize(`I-`))).value
//   // );
// });

// test("hard", () => {
//   process.env.DEBUG = "true";

//   console.log(
//     util.inspect(
//       parse(
//         tokenize(
//           `B. SF B$ B$ L" B$ L" B$ L# B$ v" B$ v# v# L# B$ v" B$ v# v# L$ L# ? B= v# I" v" B. v" B$ v$ B- v# I" Sl I#,`
//         )
//       ),
//       {
//         showHidden: false,
//         depth: null,
//         colors: true,
//       }
//     )
//   );

//   assert.strictEqual(
//     evaluate(
//       parse(
//         tokenize(
//           `B. SF B$ B$ L" B$ L" B$ L# B$ v" B$ v# v# L# B$ v" B$ v# v# L$ L# ? B= v# I" v" B. v" B$ v$ B- v# I" Sl I#,`
//         )
//       )
//     ).value,
//     2
//   );
// });

test("test problem", () => {
  const lambdaman10Source = `B. SF B$ B$ L" B$ L# B$ v" B$ v# v# L# B$ v" B$ v# v# L" L# ? B= v# I;Y S B. ? B= B% v# IS I! S~ S B. ? B= B% v# I, I! Sa Sl B$ v" B+ v# I" I"`;
  logAST(parse(tokenize(lambdaman10Source)));

  assert.strictEqual(
    evaluate(parse(tokenize(lambdaman10Source))).value,
    `L..........#..........#..........#..........#.....\n` +
      `.....#..........#..........#..........#..........#\n` +
      `..........#..........#..........#..........#......\n` +
      `....#..........#..........#..........#..........#.\n` +
      `.........#..........#..........#..........#.......\n` +
      `...#..........#..........#..........#..........#..\n` +
      `........#..........#..........#..........#........\n` +
      `..#..........#..........#..........#..........#...\n` +
      `.......#..........#..........#..........#.........\n` +
      `.#..........#..........#..........#..........#....\n` +
      `......#..........#..........#..........#..........\n` +
      `#..........#..........#..........#..........#.....\n` +
      `.....#..........#..........#..........#..........#\n` +
      `..........#..........#..........#..........#......\n` +
      `....#..........#..........#..........#..........#.\n` +
      `.........#..........#..........#..........#.......\n` +
      `...#..........#..........#..........#..........#..\n` +
      `........#..........#..........#..........#........\n` +
      `..#..........#..........#..........#..........#...\n` +
      `.......#..........#..........#..........#.........\n` +
      `.#..........#..........#..........#..........#....\n` +
      `......#..........#..........#..........#..........\n` +
      `#..........#..........#..........#..........#.....\n` +
      `.....#..........#..........#..........#..........#\n` +
      `..........#..........#..........#..........#......\n` +
      `....#..........#..........#..........#..........#.\n` +
      `.........#..........#..........#..........#.......\n` +
      `...#..........#..........#..........#..........#..\n` +
      `........#..........#..........#..........#........\n` +
      `..#..........#..........#..........#..........#...\n` +
      `.......#..........#..........#..........#.........\n` +
      `.#..........#..........#..........#..........#....\n` +
      `......#..........#..........#..........#..........\n` +
      `#..........#..........#..........#..........#.....\n` +
      `.....#..........#..........#..........#..........#\n` +
      `..........#..........#..........#..........#......\n` +
      `....#..........#..........#..........#..........#.\n` +
      `.........#..........#..........#..........#.......\n` +
      `...#..........#..........#..........#..........#..\n` +
      `........#..........#..........#..........#........\n` +
      `..#..........#..........#..........#..........#...\n` +
      `.......#..........#..........#..........#.........\n` +
      `.#..........#..........#..........#..........#....\n` +
      `......#..........#..........#..........#..........\n` +
      `#..........#..........#..........#..........#.....\n` +
      `.....#..........#..........#..........#..........#\n` +
      `..........#..........#..........#..........#......\n` +
      `....#..........#..........#..........#..........#.\n` +
      `.........#..........#..........#..........#.......\n` +
      `...#..........#..........#..........#..........#..`
  );
});

// test("test problem", () => {
//   logAST(
//     parse(
//       tokenize(
//         fs.readFileSync(
//           "/Users/matt/code/icfp2024-others/icfp-2024/problems/lambdaman/lambdaman9.raw",
//           "utf8"
//         )
//       )
//     )
//   );

//   assert.strictEqual(
//     evaluate(
//       parse(
//         tokenize(
//           fs.readFileSync(
//             "/Users/matt/code/icfp2024-others/icfp-2024/problems/lambdaman/lambdaman10.raw",
//             "utf8"
//           )
//         )
//       )
//     ).value,
//     "L......................................................................................................................................................................................................."
//   );
// });

// const repeat = (str: string, n: number) => {
//   let result = "";
//   for (let i = 0; i < n; i++) {
//     result += str;
//   }
//   return result;
// };

// test("test own exprs", () => {
//   // const expr = `B$ L" B. v" v" B$ L" B. v" v" S""""`;

//   // const expr = `B. ${repeat(`B$ L" B. v" v" `, 5)}${compileString(
//   //   "RRRRRR"
//   // )} ${compileString("RRRRRRR")}`;

//   // console.log(expr);
//   // console.log(humanIntegerToAlienInteger(41));
//   //B$ L" B$ L# B$ v" B$ v# v# L# B$ v" B$ v# v#
//   const expr = `B$ LJ B$ L" B$ L# B$ L$ B$ L% B$ L& B$ L' B$ L( B$ L) B$ L* B$ L+ B$ L, B$ L- B$ L. B$ L/ B$ L0 B$ L1 B$ L2 B$ L3 B$ L4 B$ L5 B$ L6 B$ L7 B$ L8 B$ L9 B$ L: B$ L; B$ L< B$ L= B$ L> B$ L? B$ L@ B$ LA B$ LB B$ LC B$ LD B$ LE B$ LF B$ LG B$ LH B$ LI ? B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B& B| U! v3 U! v0 B| U! v/ U! v* B| B| U! v4 vF v- U! vH B| U! v5 v3 B| B| U! v) v1 U! v9 B| U! v> U! vH B| U! v# v4 v0 B| B| U! vF v4 U! v' B| v: U! v8 B| B| U! v2 vI v6 B| B| U! v8 vD v9 B| U! v? U! v= v0 B| B| U! vF v4 v' B| U! v$ U! v, B| U! vD U! v$ B| B| U! v> vH v7 B| U! v< U! v+ B| v= U! v) B| U! v% vH B| v+ v; B| B| v7 v/ v0 U! v. B| B| vE v= U! vD B| B| U! v) v1 v9 B| B| U! v( v$ U! vI B| B| v7 v/ v0 U! v. B| B| U! v) v1 v9 B| B| U! v4 vF v- B| v+ U! v; B| U! v5 U! v3 B| U! v) U! v1 B| B| U! v$ v, U! v8 B| U! v1 vF B| U! vG U! v, B| B| U! v@ v. v/ B| U! vB v4 B| B| U! v/ v* U! v> B| v' v1 B| B| vE v= vD B| U! v4 U! vF B| U! v& v' B| v+ v; B| B| U! v$ v, v8 B| B| v; vF U! v1 B| B| v7 v/ U! v0 B| B| v: v8 vG B| vE U! v= B| U! vD v$ B| B| U! vC vD U! vF B| U! v& U! v' B| U! vB U! v4 B| B| U! v2 vI v6 B| B| U! v? v= v% B| B| U! vC vD vF B| B| v= v) v> U! v6 B| B| U! v3 v0 vH vI B| B| U! v$ v, v8 B| U! v2 U! vI B| U! vD v$ B| U! vB v4 B| B| v: v8 U! vG B| U! v< v+ B| B| vE v= vD B| B| U! v( v$ vI B| U! v, vD B| v' v1 B| B| U! v? v= v% B| U! v, U! vD B| U! vA v4 B| U! vF U! v4 B| v; U! vF B| B| U! v? v= U! v% U! v6 B| U! v5 v3 B| U! v* v@ B| B| v= v) v> B| B| U! v@ v. U! v/ B| B| U! v9 vA vD B| v- v1 B| B| U! v> vH v7 B| B| U! v/ v* v> U! vH B| U! v% U! vH B| B| U! vF v4 v' B| U! v8 U! vD B| B| U! v> vH U! v7 B| U! v& v' vI B| B| v: v8 vG B| U! v# v4 B| v- v1 B| B| U! v8 vD v9 B| U! v@ U! v. B| U! vC U! vD B| U! vA v4 B| B| U! v9 vA vD B| B| v; vF v1 B| U! vG v, B| U! v1 vF B| B| U! v( v$ vI B| U! v% vH B| U! v( U! v$ B| B| U! v9 vA U! vD B| B| U! vC vD vF B| U! v, vD v" B| U! v< v+ B| B| U! v8 vD U! v9 B| B| U! v3 v0 U! vH B| B| U! v4 vF U! v- B| B| v; vF v1 B| v' U! v1 B| B| U! v2 vI U! v6 B| U! v* U! v@ B| U! vA U! v4 B| U! vG v, B| U! v* v@ B| B| U! v/ v* v> B| B| U! v3 v0 vH B| v- U! v1 B| U! v1 U! vF B| v7 U! v/ B| B| v= v) U! v> v" B| U! v9 U! vA B| U! v# U! v4 B| B| U! v@ v. v/ vJ SB%,,/ B< I! B% B/ vJ IkvEaR3 I# B< I! B% B/ vJ IFKbA9Y I# B< I! B% B/ vJ I3eA\`-= I# B< I! B% B/ vJ I*C1@V/ I# B< I! B% B/ vJ I%a)0jW I# B< I! B% B/ vJ I#A%(tk I# B< I! B% B/ vJ I"1#$yu I# B< I! B% B/ vJ IX""|K I# B< I! B% B/ vJ I<PP}e I# B< I! B% B/ vJ I.gg~C I# B< I! B% B/ vJ I'sDOa I# B< I! B% B/ vJ I$J2gA I# B< I! B% B/ vJ I"dXs1 I# B< I! B% B/ vJ Iqky) I# B< I! B% B/ vJ IIFM% I# B< I! B% B/ vJ I53f# I# B< I! B% B/ vJ I+*CQ I# B< I! B% B/ vJ I&%a9 I# B< I! B% B/ vJ I#RA- I# B< I! B% B/ vJ I"9\`' I# B< I! B% B/ vJ I\@S I# B< I! B% B/ vJ I>_i I# B< I! B% B/ vJ I/oE I# B< I! B% B/ vJ I(H3 I# B< I! B% B/ vJ I$cY I# B< I! B% B/ vJ I"q= I# B< I! B% B/ vJ Ix/ I# B< I! B% B/ vJ ILW I# B< I! B% B/ vJ I6k I# B< I! B% B/ vJ I+u I# B< I! B% B/ vJ I&K I# B< I! B% B/ vJ I#e I# B< I! B% B/ vJ I"C I# B< I! B% B/ vJ Ia I# B< I! B% B/ vJ IA I# B< I! B% B/ vJ I1 I# B< I! B% B/ vJ I) I# B< I! B% B/ vJ I% I# B< I! B% B/ vJ I# I# B< I! B% B/ vJ I" I# `;

//   // console.log(
//   //   util.inspect(parse(tokenize(expr)), {
//   //     showHidden: false,
//   //     depth: null,
//   //     colors: true,
//   //   })
//   // );
//   // logAST(parse(tokenize(expr)));
//   // [2,4,8,16,32,64,128,256,512,1024,2048,2964,4096,8192,16384,32768,65536,131072,262144,1048576,2097152,4194304,8388608,16777216,33554432,67108864,134217728,268435456,536870912,1073741824,2147483648,4294967296,8589934592,17179869184,34359738368,68719476736,137438953472,274877906944,549755813888]

//   let nums = expr
//     .split(" ")
//     .filter((e) => e.startsWith("I"))
//     .map((e) => alienIntegerToHumanInteger(e.slice(1)));
//   // .map((e) => parseInt(e + "", 10));
//   nums.sort((a, b) => a - b);
//   console.log(JSON.stringify(nums));
//   // console.log(
//   //   evaluate(
//   //     parse(
//   //       tokenize(expr + `I${humanIntegerToAlienInteger(549755813888 * 2 + 1)}`)
//   //     )
//   //   )
//   // );

//   // let primes = [];
//   // for (let i = 2; i < 10000000; i++) {
//   //   let isPrime = true;
//   //   for (let j = 2; j * j <= i; j++) {
//   //     if (i % j === 0) {
//   //       isPrime = false;
//   //       break;
//   //     }
//   //   }
//   //   if (isPrime) {
//   //     primes.push(i);
//   //   }
//   // }
//   let sum = 0;
//   for (let i = 0; i < 1000; i++) {
//     // const curr = nums[i];
//     // sum = Math.pow(2, i);
//     for (let j = 0; j <= 40; j++) {
//       const res = evaluate(
//         parse(tokenize(expr + `I${humanIntegerToAlienInteger(nums[j] * i)}`))
//       );
//       if (res.value !== "Hello") {
//         console.log(i, res.value);
//         process.exit();
//       }
//     }

//     // else {
//     //   console.log(i, res.value);
//     // }
//   }
//   //   // console.log(evaluate(parse(tokenize(expr))).value);
// });

// B. SF B$ B$ L" B$ L" B$ L# B$ v" B$ v# v# L# B$ v" B$ v# v# L$ L# ? B= v# I" v" B. v" B$ v$ B- v# I" Sl I#,

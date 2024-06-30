import test from "node:test";
import { evaluate } from "./evaluate";
import { tokenize } from "./lex";
import { parse } from "./parse";
import assert = require("assert/strict");
const util = require("util");

// test("value", () => {
//   assert.strictEqual(evaluate(parse(tokenize("I/6"), 0)).value, 1337);
//   assert.strictEqual(
//     evaluate(parse(tokenize("SB%,,/}Q/2,$_"), 0)).value,
//     "Hello World!"
//   );
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

//   assert.strictEqual(
//     evaluate(parse(tokenize("B$ B$ L# L$ v# B. SB%,,/ S}Q/2,$_ IK"))).value,
//     "Hello World!"
//   );

//   assert.strictEqual(
//     evaluate(parse(tokenize(`B$ L# B$ L" B+ v" v" B* I$ I# v8`))).value,
//     evaluate(parse(tokenize(`I-`))).value
//   );

//   assert.strictEqual(
//     evaluate(parse(tokenize(`B$ L# B$ L" B+ v" v" B* I$ I# v8`))).value,
//     evaluate(parse(tokenize(`I-`))).value
//   );
// });

test("hard", () => {
  process.env.DEBUG = "true";

  console.log(
    util.inspect(
      parse(
        tokenize(
          `B. SF B$ B$ L" B$ L" B$ L# B$ v" B$ v# v# L# B$ v" B$ v# v# L$ L# ? B= v# I" v" B. v" B$ v$ B- v# I" Sl I#,`
        )
      ),
      {
        showHidden: false,
        depth: null,
        colors: true,
      }
    )
  );

  assert.strictEqual(
    evaluate(
      parse(
        tokenize(
          `B. SF B$ B$ L" B$ L" B$ L# B$ v" B$ v# v# L# B$ v" B$ v# v# L$ L# ? B= v# I" v" B. v" B$ v$ B- v# I" Sl I#,`
        )
      )
    ).value,
    2
  );
});
// B. SF B$ B$ L" B$ L" B$ L# B$ v" B$ v# v# L# B$ v" B$ v# v# L$ L# ? B= v# I" v" B. v" B$ v$ B- v# I" Sl I#,

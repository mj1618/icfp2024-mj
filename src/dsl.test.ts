import test from "node:test";
import {
  Dsl,
  Y,
  apply,
  compileDsl,
  f,
  fn,
  gt,
  ifThenElse,
  int,
  mult,
  n,
  sub,
  var_,
} from "./dsl";
import { evaluate } from "./evaluate-stack";
import { tokenize } from "./lex";
import { parse } from "./parse";
import assert = require("assert/strict");
import exp = require("constants");
const util = require("util");
const fs = require("fs");

const assertExpr = (dsl: Dsl, expected: any) => {
  console.log(compileDsl(dsl, {}, 0));
  assert.strictEqual(
    evaluate(parse(tokenize(compileDsl(dsl, {}, 0)), 0)).value,
    expected
  );
};

// test("value", () => {
//   assertExpr(int(1337), 1337);
//   assertExpr(str("Hello world!"), "Hello world!");
// });

// test("unary", () => {
//   assertExpr(neg(int(3)), -3);
//   assertExpr(not(T), false);
//   assertExpr(stringToInt(str("test")), 15818151);
//   assertExpr(intToString(int(15818151)), "test");
// });

// // test("binary", () => {
// //   assert.strictEqual(evaluate(parse(tokenize("B+ I# I$"), 0)).value, 5);
// //   assert.strictEqual(evaluate(parse(tokenize("B- I$ I#"), 0)).value, 1);
// //   assert.strictEqual(evaluate(parse(tokenize("B* I$ I#"), 0)).value, 6);
// //   assert.strictEqual(evaluate(parse(tokenize("B/ U- I( I#"), 0)).value, -3);
// //   assert.strictEqual(evaluate(parse(tokenize("B% U- I( I#"), 0)).value, -1);
// //   assert.strictEqual(evaluate(parse(tokenize("B< I$ I#"), 0)).value, false);
// //   assert.strictEqual(evaluate(parse(tokenize("B> I$ I#"), 0)).value, true);
// //   assert.strictEqual(evaluate(parse(tokenize("B= I$ I#"), 0)).value, false);
// //   assert.strictEqual(evaluate(parse(tokenize("B| T F"), 0)).value, true);
// //   assert.strictEqual(evaluate(parse(tokenize("B& T F"), 0)).value, false);
// //   assert.strictEqual(evaluate(parse(tokenize("B. S4% S34"), 0)).value, "test");
// //   assert.strictEqual(evaluate(parse(tokenize("BT I$ S4%34"), 0)).value, "tes");
// //   assert.strictEqual(evaluate(parse(tokenize("BD I$ S4%34"), 0)).value, "t");
// // });

// test("if", () => {
//   assertExpr(ifThenElse(gt(int(1), int(2)), str("yes"), str("no")), "no");
// });

// test("lambda", () => {
//   assertExpr(
//     apply(
//       lam(
//         "x",
//         apply(lam("y", add(var_("y"), var_("y"))), mult(int(2), int(3)))
//       ),
//       int(1)
//     ),
//     evaluate(parse(tokenize(`I-`))).value
//   );
// });

test("factorial", () => {
  const factorial = fn(
    [f, n],
    ifThenElse(
      gt(var_(n), int(1)),
      mult(var_(n), apply(var_(f), sub(var_(n), int(1)))),
      int(1)
    )
  );

  const expr = apply(Y(factorial), int(5));

  assertExpr(expr, 120);
});

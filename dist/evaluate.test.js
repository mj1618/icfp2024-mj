"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const evaluate_1 = require("./evaluate");
const lex_1 = require("./lex");
const parse_1 = require("./parse");
const assert = require("assert/strict");
const util = require("util");
const v8 = require("v8");
v8.setFlagsFromString("--stack-size=9999999999");
v8.setFlagsFromString("--stack_size=9999999999");
(0, node_test_1.default)("value", () => {
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("I/6"), 0)).value, 1337);
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("SB%,,/}Q/2,$_"), 0)).value, "Hello World!");
});
(0, node_test_1.default)("unary", () => {
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("U- I$"), 0)).value, -3);
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("U! T"), 0)).value, false);
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("U# S4%34"), 0)).value, 15818151);
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("U$ I4%34"), 0)).value, "test");
});
(0, node_test_1.default)("binary", () => {
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("B+ I# I$"), 0)).value, 5);
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("B- I$ I#"), 0)).value, 1);
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("B* I$ I#"), 0)).value, 6);
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("B/ U- I( I#"), 0)).value, -3);
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("B% U- I( I#"), 0)).value, -1);
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("B< I$ I#"), 0)).value, false);
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("B> I$ I#"), 0)).value, true);
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("B= I$ I#"), 0)).value, false);
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("B| T F"), 0)).value, true);
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("B& T F"), 0)).value, false);
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("B. S4% S34"), 0)).value, "test");
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("BT I$ S4%34"), 0)).value, "tes");
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("BD I$ S4%34"), 0)).value, "t");
});
(0, node_test_1.default)("if", () => {
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("? B> I# I$ S9%3 S./"), 0)).value, "no");
});
(0, node_test_1.default)("lambda", () => {
    // console.log(
    //   util.inspect(parse(tokenize("B$ B$ L# L$ v# B. SB%,,/ S}Q/2,$_ IK")), {
    //     showHidden: false,
    //     depth: null,
    //     colors: true,
    //   })
    // );
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)("B$ B$ L# L$ v# B. SB%,,/ S}Q/2,$_ IK"))).value, "Hello World!");
});
(0, node_test_1.default)("hard", () => {
    console.log(util.inspect((0, parse_1.parse)((0, lex_1.tokenize)(`B. SF B$ B$ L" B$ L" B$ L# B$ v" B$ v# v# L# B$ v" B$ v# v# L$ L# ? B= v# I" v" B. v" B$ v$ B- v# I" Sl I#,`)), {
        showHidden: false,
        depth: null,
        colors: true,
    }));
    assert.strictEqual((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)(`B. SF B$ B$ L" B$ L" B$ L# B$ v" B$ v# v# L# B$ v" B$ v# v# L$ L# ? B= v# I" v" B. v" B$ v$ B- v# I" Sl I#,`))).value, "Hello World!");
});
// B. SF B$ B$ L" B$ L" B$ L# B$ v" B$ v# v# L# B$ v" B$ v# v# L$ L# ? B= v# I" v" B. v" B$ v$ B- v# I" Sl I#,
//# sourceMappingURL=evaluate.test.js.map
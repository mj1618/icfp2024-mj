import test from "node:test";
import { getSequence } from "./spaceship";
import assert = require("assert/strict");
const util = require("util");

test("spaceship", () => {
  const seq = getSequence(10);

  console.log(seq);

  assert.strictEqual(1337, 1337);
});

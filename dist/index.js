"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const evaluate_1 = require("./evaluate");
const lambdaman_1 = require("./lambdaman");
const lex_1 = require("./lex");
const parse_1 = require("./parse");
const util_1 = require("./util");
const main = async () => {
    for (let i = 6; i <= 50; i++) {
        await (0, lambdaman_1.solveLambdaMan)(i);
    }
    // await sendToServer("solve language_test 4w3s0m3");
    const res = (0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)(`B. SF B$ B$ L" B$ L" B$ L# B$ v" B$ v# v# L# B$ v" B$ v# v# L$ L# ? B= v# I" v" B. v" B$ v$ B- v# I" Sl I#,`))).value;
    (0, util_1.logObject)(res);
};
exports.main = main;
(0, exports.main)();
//# sourceMappingURL=index.js.map
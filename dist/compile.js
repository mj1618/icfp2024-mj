"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileString = void 0;
const constants_1 = require("./constants");
const compileString = (str) => {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(constants_1.alienChars.indexOf(str.charAt(i)) + 33);
    }
    return "S" + result;
};
exports.compileString = compileString;
//# sourceMappingURL=compile.js.map
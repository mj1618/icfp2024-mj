"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToServer = exports.sendRawToServer = exports.logObject = exports.alienIntegerToHumanInteger = exports.alienStringToHumanString = exports.humanIntegerToAlienInteger = exports.humanStringToAlienString = exports.send = void 0;
const compile_1 = require("./compile");
const constants_1 = require("./constants");
const evaluate_1 = require("./evaluate");
const lex_1 = require("./lex");
const parse_1 = require("./parse");
const util = require("util");
const token = "1c424ec1-904c-4ebc-bda0-deaa2d02c95d";
const send = async (body) => {
    const response = await fetch("https://boundvariable.space/communicate", {
        method: "POST",
        body: body,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(response.status, response.statusText);
    const data = await response.text();
    return data;
};
exports.send = send;
const humanStringToAlienString = (source) => {
    let result = "";
    for (let i = 0; i < source.length; i++) {
        result += String.fromCharCode(constants_1.alienChars.indexOf(source.charAt(i)) + 33);
    }
    return result;
};
exports.humanStringToAlienString = humanStringToAlienString;
const humanIntegerToAlienInteger = (source) => {
    let result = "";
    while (source > 0) {
        result = String.fromCharCode((source % 94) + 33) + result;
        source = Math.floor(source / 94);
    }
    return result;
};
exports.humanIntegerToAlienInteger = humanIntegerToAlienInteger;
const alienStringToHumanString = (source) => {
    let result = "";
    for (let i = 0; i < source.length; i++) {
        result += constants_1.alienChars.charAt(source.charCodeAt(i) - 33);
    }
    return result;
};
exports.alienStringToHumanString = alienStringToHumanString;
const alienIntegerToHumanInteger = (source) => {
    let result = 0;
    for (let i = 0; i < source.length; i++) {
        result += (source.charCodeAt(i) - 33) * Math.pow(94, source.length - i - 1);
    }
    return result;
};
exports.alienIntegerToHumanInteger = alienIntegerToHumanInteger;
const logObject = (obj) => {
    console.log(util.inspect(obj, {
        showHidden: false,
        depth: null,
        colors: true,
    }));
};
exports.logObject = logObject;
const sendRawToServer = async (source) => {
    const response = await (0, exports.send)(source);
    console.log(response);
    (0, exports.logObject)((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)(response))));
    return (0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)(response)));
};
exports.sendRawToServer = sendRawToServer;
const sendToServer = async (source) => {
    const response = await (0, exports.send)((0, compile_1.compileString)(source));
    console.log(response);
    (0, exports.logObject)((0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)(response))));
    return (0, evaluate_1.evaluate)((0, parse_1.parse)((0, lex_1.tokenize)(response)));
};
exports.sendToServer = sendToServer;
//# sourceMappingURL=util.js.map
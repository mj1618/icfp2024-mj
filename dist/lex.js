"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = void 0;
const constants_1 = require("./constants");
const util_1 = require("./util");
const tokenizeString = (source) => {
    return { type: "string", value: (0, util_1.alienStringToHumanString)(source) };
};
const tokenizeInteger = (source) => {
    return { type: "integer", value: (0, util_1.alienIntegerToHumanInteger)(source) };
};
const tokenizeUnary = (source) => {
    return {
        type: "unary",
        value: constants_1.unaryMap[source.charAt(0)],
    };
};
const tokenizeBinary = (source) => {
    return {
        type: "binary",
        value: constants_1.binaryMap[source.charAt(0)],
    };
};
const tokenizeLambda = (source) => {
    return {
        type: "lambda",
        value: (0, util_1.alienIntegerToHumanInteger)(source),
    };
};
const tokenizeVariable = (source) => {
    return {
        type: "variable",
        value: (0, util_1.alienIntegerToHumanInteger)(source),
    };
};
const tokenize = (original) => {
    const sources = original.split(" ");
    return sources.map((source) => {
        if (source.charAt(0) === "S") {
            return tokenizeString(source.slice(1));
        }
        else if (source.charAt(0) === "I") {
            return tokenizeInteger(source.slice(1));
        }
        else if (source.charAt(0) === "U") {
            return tokenizeUnary(source.slice(1));
        }
        else if (source.charAt(0) === "B") {
            return tokenizeBinary(source.slice(1));
        }
        else if (source.charAt(0) === "?") {
            return { type: "if" };
        }
        else if (source.charAt(0) === "L") {
            return tokenizeLambda(source.slice(1));
        }
        else if (source.charAt(0) === "v") {
            return tokenizeVariable(source.slice(1));
        }
        else if (source.charAt(0) === "T") {
            return { type: "boolean", value: true };
        }
        else if (source.charAt(0) === "F") {
            return { type: "boolean", value: false };
        }
        else {
            throw new Error("Unknown token: " + source);
        }
    });
};
exports.tokenize = tokenize;
//# sourceMappingURL=lex.js.map
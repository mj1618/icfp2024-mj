"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = void 0;
const util_1 = require("./util");
const v8 = require("v8");
v8.setFlagsFromString("--stack-size=9999999999");
// const cache: { [key: number]: { result: Result; env: Env }[] } = {};
// if (cache[node.id] !== undefined) {
//   const cached = cache[node.id].find((c) => true);
//   if (cached !== undefined) {
//     console.log("found!");
//     return cached.result;
//   }
// }
// console.log(env, lambdaArguments, node.value, node.child);
// if (cache[node.id] === undefined) {
//   cache[node.id] = [];
// }
// cache[node.id].push({ result, env });
const evaluate = (node, env = {}, lambdaArguments = []) => {
    switch (node.type) {
        case "string":
            return node;
        case "integer":
            return node;
        case "boolean":
            return node;
        case "lambda":
            let result = lambdaArguments.length === 0
                ? (0, exports.evaluate)(node.child, env, [])
                : (0, exports.evaluate)(node.child, { ...env, [node.value]: lambdaArguments[0] }, lambdaArguments.slice(1));
            return result;
        case "variable":
            if (env[node.value] === undefined) {
                throw new Error("Variable not defined");
            }
            return (0, exports.evaluate)(env[node.value], env);
        case "if":
            if ((0, exports.evaluate)(node.condition, env).value) {
                return (0, exports.evaluate)(node.then, env);
            }
            else {
                return (0, exports.evaluate)(node.else, env);
            }
        case "unary":
            const child = (0, exports.evaluate)(node.child, env);
            switch (node.value) {
                case "negate":
                    return { type: "integer", value: -1 * child.value };
                case "not":
                    return { type: "boolean", value: !child.value };
                case "string-to-int":
                    return {
                        type: "integer",
                        value: (0, util_1.alienIntegerToHumanInteger)((0, util_1.humanStringToAlienString)(child.value)),
                    };
                case "int-to-string":
                    return {
                        type: "string",
                        value: (0, util_1.alienStringToHumanString)((0, util_1.humanIntegerToAlienInteger)(child.value)),
                    };
            }
        case "binary":
            switch (node.value) {
                case "add":
                    return {
                        type: "integer",
                        value: (0, exports.evaluate)(node.left, env).value +
                            (0, exports.evaluate)(node.right, env).value,
                    };
                case "subtract":
                    return {
                        type: "integer",
                        value: (0, exports.evaluate)(node.left, env).value -
                            (0, exports.evaluate)(node.right, env).value,
                    };
                case "mult":
                    return {
                        type: "integer",
                        value: (0, exports.evaluate)(node.left, env).value *
                            (0, exports.evaluate)(node.right, env).value,
                    };
                case "div":
                    const divVal = (0, exports.evaluate)(node.left, env).value /
                        (0, exports.evaluate)(node.right, env).value;
                    if (divVal < 0) {
                        return {
                            type: "integer",
                            value: Math.ceil(divVal),
                        };
                    }
                    else {
                        return {
                            type: "integer",
                            value: Math.floor(divVal),
                        };
                    }
                case "mod":
                    return {
                        type: "integer",
                        value: (0, exports.evaluate)(node.left, env).value %
                            (0, exports.evaluate)(node.right, env).value,
                    };
                case "lt":
                    return {
                        type: "boolean",
                        value: (0, exports.evaluate)(node.left, env).value <
                            (0, exports.evaluate)(node.right, env).value,
                    };
                case "gt":
                    return {
                        type: "boolean",
                        value: (0, exports.evaluate)(node.left, env).value >
                            (0, exports.evaluate)(node.right, env).value,
                    };
                case "equal":
                    return {
                        type: "boolean",
                        value: (0, exports.evaluate)(node.left, env).value ===
                            (0, exports.evaluate)(node.right, env).value,
                    };
                case "or":
                    return {
                        type: "boolean",
                        value: (0, exports.evaluate)(node.left, env).value ||
                            (0, exports.evaluate)(node.right, env).value,
                    };
                case "and":
                    return {
                        type: "boolean",
                        value: (0, exports.evaluate)(node.left, env).value &&
                            (0, exports.evaluate)(node.right, env).value,
                    };
                case "string-concat":
                    return {
                        type: "string",
                        value: (0, exports.evaluate)(node.left, env).value +
                            (0, exports.evaluate)(node.right, env).value,
                    };
                case "take":
                    return {
                        type: "string",
                        value: (0, exports.evaluate)(node.right, env).value.slice(0, (0, exports.evaluate)(node.left, env).value),
                    };
                case "drop":
                    return {
                        type: "string",
                        value: (0, exports.evaluate)(node.right, env).value.slice((0, exports.evaluate)(node.left, env).value),
                    };
                case "apply":
                    if (node.right == null) {
                        throw new Error("apply has no right");
                    }
                    // logObject(node.right);
                    return (0, exports.evaluate)(node.left, env, [node.right].concat(lambdaArguments));
            }
    }
};
exports.evaluate = evaluate;
//# sourceMappingURL=evaluate.js.map
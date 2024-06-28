"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const parse = (tokens, fromIndex = 0) => {
    const curr = tokens[fromIndex];
    const id = fromIndex;
    switch (curr.type) {
        case "string":
            return { ...curr, newFromIndex: fromIndex + 1, id };
        case "integer":
            return { ...curr, newFromIndex: fromIndex + 1, id };
        case "boolean":
            return { ...curr, newFromIndex: fromIndex + 1, id };
        case "unary":
            const child = (0, exports.parse)(tokens, fromIndex + 1);
            return { ...curr, child, newFromIndex: child.newFromIndex, id };
        case "binary":
            const left = (0, exports.parse)(tokens, fromIndex + 1);
            const right = (0, exports.parse)(tokens, left.newFromIndex);
            return { ...curr, left, right, newFromIndex: right.newFromIndex, id };
        case "if":
            const condition = (0, exports.parse)(tokens, fromIndex + 1);
            const then = (0, exports.parse)(tokens, condition.newFromIndex);
            const elseNode = (0, exports.parse)(tokens, then.newFromIndex);
            return {
                type: "if",
                condition,
                then,
                else: elseNode,
                newFromIndex: elseNode.newFromIndex,
                id,
            };
        case "lambda":
            const lamChild = (0, exports.parse)(tokens, fromIndex + 1);
            return {
                ...curr,
                child: lamChild,
                newFromIndex: lamChild.newFromIndex,
                id,
            };
        case "variable":
            return { ...curr, newFromIndex: fromIndex + 1, id };
    }
};
exports.parse = parse;
//# sourceMappingURL=parse.js.map
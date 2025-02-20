import assert = require("node:assert");
import { ASTLambda, ASTNode, ASTValue } from "./parse";
import {
  alienIntegerToHumanInteger,
  alienStringToHumanString,
  humanIntegerToAlienInteger,
  humanStringToAlienString,
} from "./util";

export type Result =
  | {
      type: "string";
      value: string;
    }
  | { type: "integer"; value: number }
  | { type: "boolean"; value: boolean }
  | ASTNode;

type Env = { [key: number]: ASTNode };

const replaceVar = (
  node: ASTNode,
  varName: number,
  value: ASTNode
): ASTNode => {
  // console.log("replacing", varName, value, node);
  switch (node.type) {
    case "string":
      return node;
    case "integer":
      return node;
    case "boolean":
      return node;
    case "lambda":
      if (node.value === varName) {
        return node;
      } else {
        return { ...node, child: replaceVar(node.child, varName, value) };
      }
    case "variable":
      // console.log("var", node.value, varName, value);
      if (node.value === varName) {
        return value;
      } else {
        return node;
      }
    case "if":
      return {
        ...node,
        condition: replaceVar(node.condition, varName, value),
        then: replaceVar(node.then, varName, value),
        else: replaceVar(node.else, varName, value),
      };
    case "unary":
      return { ...node, child: replaceVar(node.child, varName, value) };
    case "binary":
      return {
        ...node,
        left: replaceVar(node.left, varName, value),
        right: replaceVar(node.right, varName, value),
      };
  }
};

export const evaluate = (node: ASTNode, env: Env = {}): ASTValue => {
  console.log("");
  return evaluateStack(node) as ASTValue;
};

export const logValue = (message: string) => {
  process.stdout.write(message + " ");
};

const repeat = (str: string, n: number) => {
  return new Array(n * 1).fill(str).join("");
};

export const logAST = (node: ASTNode, indent = 0) => {
  // console.log(node);
  switch (node.type) {
    case "string":
      logValue(`${repeat(" ", indent)}(Str:${node.value})`);
      break;
    case "integer":
      logValue(`${repeat(" ", indent)}(Int:${node.value})`);
      break;
    case "boolean":
      logValue(`${repeat(" ", indent)}(Bool:${node.value})`);
      break;
    case "lambda":
      logValue(`${repeat(" ", indent)}(lambda${node.value}`);
      console.log();
      logAST(node.child, indent + 1);
      console.log();
      logValue(`${repeat(" ", indent)})`);
      break;
    case "variable":
      logValue(`${repeat(" ", indent)}(variable${node.value})`);
      break;
    case "if":
      logValue(`${repeat(" ", indent)}(if `);
      console.log();
      logAST(node.condition, indent + 1);
      console.log();
      logAST(node.then, indent + 1);
      console.log();
      logAST(node.else, indent + 1);
      console.log();
      logValue(`${repeat(" ", indent)})`);
      break;
    case "unary":
      logValue(`${repeat(" ", indent)}(${node.value}`);
      console.log();
      logAST(node.child, indent + 1);
      console.log();
      logValue(`${repeat(" ", indent)})`);
      break;
    case "binary":
      logValue(`${repeat(" ", indent)}(${node.value}`);
      console.log();
      logAST(node.left, indent + 1);
      console.log();
      logAST(node.right, indent + 1);
      console.log();
      logValue(`${repeat(" ", indent)})`);
      break;
  }
};

export const evaluateBinary = (
  value: string,
  left: ASTValue,
  right: ASTValue
): ASTValue => {
  switch (value) {
    case "add":
      return {
        type: "integer",
        value: (left.value as number) + (right.value as number),
      };
    case "subtract":
      return {
        type: "integer",
        value: (left.value as number) - (right.value as number),
      };
    case "mult":
      return {
        type: "integer",
        value: (left.value as number) * (right.value as number),
      };
    case "div":
      const divVal = (left.value as number) / (right.value as number);
      if (divVal < 0) {
        return {
          type: "integer",
          value: Math.ceil(divVal),
        };
      } else {
        return {
          type: "integer",
          value: Math.floor(divVal),
        };
      }
    case "mod":
      return {
        type: "integer",
        value: (left.value as number) % (right.value as number),
      };
    case "lt":
      return {
        type: "boolean",
        value: (left.value as number) < (right.value as number),
      };
    case "gt":
      return {
        type: "boolean",
        value: (left.value as number) > (right.value as number),
      };
    case "equal":
      return {
        type: "boolean",
        value: left.value == right.value,
      };
    case "or":
      return {
        type: "boolean",
        value: (left.value as boolean) || (right.value as boolean),
      };
    case "and":
      return {
        type: "boolean",
        value: (left.value as boolean) && (right.value as boolean),
      };
    case "string-concat":
      const value = (left.value as string) + (right.value as string);
      return {
        type: "string",
        value,
      };
    case "take":
      return {
        type: "string",
        value: (right.value as string).slice(0, left.value as number),
      };
    case "drop":
      return {
        type: "string",
        value: (right.value as string).slice(left.value as number),
      };
    default:
      throw new Error("invalid binary operator");
  }
};

export const evaluateUnary = (value: string, child: ASTValue): ASTValue => {
  switch (value) {
    case "negate":
      return {
        type: "integer",
        value: -1 * (child.value as number),
      };
    case "not":
      return {
        type: "boolean",
        value: !(child.value as boolean),
      };
    case "string-to-int":
      return {
        type: "integer",
        value: alienIntegerToHumanInteger(
          humanStringToAlienString(child.value as string)
        ),
      };
    case "int-to-string":
      return {
        type: "string",
        value: alienStringToHumanString(
          humanIntegerToAlienInteger(child.value as number)
        ),
      };
    default:
      throw new Error("invalid unary operator");
  }
};

export const evaluateStack = (node: ASTNode): ASTValue => {
  return evaluateASTStack(node) as ASTValue;
};

let id = 0;

export const evaluateASTStack = (root: ASTNode): ASTNode => {
  const expressions: ASTNode[] = [{ ...root, id: id++, parentId: -1 }];
  let values: { [key: string]: ASTNode[] } = {};
  const addValue = (node: ASTNode) => {
    values[node.parentId!!] = values[node.parentId!!]
      ? values[node.parentId!!].concat(node)
      : [node];
  };
  const getValues = (node: ASTNode) => values[node.id!!] || [];
  const popValues = (node: ASTNode) => {
    const vs = values[node.id!!] || [];
    delete values[node.id!!];
    return vs;
  };

  while (expressions.length > 0) {
    // console.log(
    //   "\n--------------------------------------------------- reducing ---------------------------------------------------"
    // );
    // console.log("expressions", expressions);
    // console.log("values", values);

    const node = expressions.pop()!;

    switch (node.type) {
      case "string":
      case "integer":
      case "boolean":
      case "lambda":
        addValue(node);
        break;

      case "variable":
        throw new Error("non-replaced variable found: " + node.value);

      case "if":
        if (getValues(node).length > 0) {
          const ifValues = popValues(node);
          const conditionValue = ifValues.pop()! as ASTValue;
          if (conditionValue.value) {
            expressions.push({
              ...node.then,
              id: id++,
              parentId: node.parentId,
            });
          } else {
            expressions.push({
              ...node.else,
              id: id++,
              parentId: node.parentId,
            });
          }
        } else {
          expressions.push(node);
          expressions.push({ ...node.condition, id: id++, parentId: node.id });
        }

        break;
      case "unary":
        if (getValues(node).length > 0) {
          const childValue = popValues(node)[0] as ASTValue;
          const result = evaluateUnary(node.value, childValue as ASTValue);
          addValue({
            ...result,
            id: id++,
            parentId: node.parentId,
          });
        } else {
          expressions.push(node);
          expressions.push({ ...node.child, id: id++, parentId: node.id });
        }
        break;

      case "binary":
        if (getValues(node).length === 2) {
          const binaryValues = popValues(node);
          if (node.value === "apply") {
            const leftLambda = binaryValues.pop()!! as ASTLambda & ASTNode;
            const rightValue = binaryValues.pop()!! as ASTValue;
            assert(leftLambda.type === "lambda");
            const newChild = replaceVar(
              leftLambda.child,
              (leftLambda as ASTLambda).value as number,
              rightValue
            ) as ASTLambda;
            expressions.push({
              ...newChild,
              id: id++,
              parentId: node.parentId,
            });
          } else {
            const leftVal = binaryValues.pop()!! as ASTValue;
            const rightVal = binaryValues.pop()!! as ASTValue;
            addValue({
              ...evaluateBinary(node.value, leftVal, rightVal),
              id: id++,
              parentId: node.parentId,
            });
          }
        } else {
          if (node.value === "apply") {
            expressions.push(node);
            expressions.push({
              ...node.left,
              id: id++,
              parentId: node.id,
            });
            addValue({ ...node.right, id: id++, parentId: node.id });
          } else {
            expressions.push(node);
            expressions.push({
              ...node.left,
              id: id++,
              parentId: node.id,
            });
            expressions.push({ ...node.right, id: id++, parentId: node.id });
          }
        }
        break;
    }
  }
  // console.log("values", values);

  return getValues({ id: -1 } as any)[0] as ASTNode;
};

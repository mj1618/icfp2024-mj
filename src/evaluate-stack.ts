import assert = require("node:assert");
import { evaluateAST } from "./evaluate";
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
  root = node;
  return evaluateAST(node, env) as ASTValue;
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

let root: ASTNode | null = null;

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

export const evaluateStack = (node: ASTNode, env: Env = {}): ASTValue => {
  return evaluateASTStack(node, env) as ASTValue;
};

export const evaluateASTStack = (root: ASTNode, env: Env = {}): ASTNode => {
  // if (root != null) {
  //   logAST(node);
  //   console.log("");
  // }

  const unreduced: ASTNode[] = [root];
  const reduced: ASTNode[] = [];
  const values: ASTNode[] = [];

  while (reduced.length > 0 || unreduced.length > 0) {
    while (unreduced.length > 0) {
      console.log(
        "\n--------------------------------------------------- reducing ---------------------------------------------------"
      );
      console.log("unreduced", unreduced);
      console.log("reduced", reduced);
      console.log("values", values);

      const node = unreduced.shift()!;
      switch (node.type) {
        case "string":
        case "integer":
        case "boolean":
        case "lambda":
          values.push(node);
          break;

        case "variable":
          throw new Error("variable not implemented");
        // values.push(node);
        // break;
        case "if":
          reduced.push(node);
          unreduced.push(node.condition);
          break;
        case "unary":
          reduced.push(node);
          unreduced.push(node.child);
          break;
        case "binary":
          if (node.value === "apply") {
            reduced.push(node);
            unreduced.push(node.left);
            values.push(node.right);
          } else {
            reduced.push(node);
            unreduced.push(node.left);
            unreduced.push(node.right);
          }

          // console.log("stack!", stack);
          break;
      }
    }

    // let currUnreduced = unreduced.length;
    while (reduced.length > 0) {
      const node = reduced[reduced.length - 1];

      if (
        (node.type === "unary" && values.length > 0) ||
        (node.type === "if" && values.length > 0) ||
        (node.type === "binary" && values.length >= 2) ||
        (node.type !== "binary" && node.type !== "unary" && node.type !== "if")
      ) {
        console.log(
          "\n--------------------------------------------------- evaluating ---------------------------------------------------"
        );
        console.log("unreduced", unreduced);
        console.log("reduced", reduced);
        console.log("values", values);
        reduced.pop();

        switch (node.type) {
          case "string":
          case "integer":
          case "boolean":
          case "lambda":
            values.push(node);
            break;
          case "variable":
            throw new Error("variable not implemented");
          // values.push(node);
          // break;
          case "if":
            if ((values.pop()!! as ASTValue).value as boolean) {
              unreduced.push(node.then);
            } else {
              unreduced.push(node.else);
            }
            break;
          case "unary":
            const child = values.pop()!! as ASTValue;
            switch (node.value) {
              case "negate":
                values.push({
                  type: "integer",
                  value: -1 * (child.value as number),
                });
                break;
              case "not":
                values.push({
                  type: "boolean",
                  value: !(child.value as boolean),
                });
                break;
              case "string-to-int":
                values.push({
                  type: "integer",
                  value: alienIntegerToHumanInteger(
                    humanStringToAlienString(child.value as string)
                  ),
                });
                break;
              case "int-to-string":
                values.push({
                  type: "string",
                  value: alienStringToHumanString(
                    humanIntegerToAlienInteger(child.value as number)
                  ),
                });
                break;
            }
            break;
          case "binary":
            assert(values.length >= 2, "not enough values on stack");

            switch (node.value) {
              case "add":
              case "subtract":
              case "mult":
              case "div":
              case "mod":
              case "lt":
              case "gt":
              case "equal":
              case "or":
              case "and":
              case "string-concat":
              case "take":
              case "drop":
                const rightArg = values.pop()!! as ASTValue;
                const leftArg = values.pop()!! as ASTValue;
                values.push(
                  evaluateBinary(node.value, leftArg, rightArg) as ASTValue
                );
                break;

              case "apply":
                const leftLambda = values.pop()!! as ASTLambda;
                const rightValue = values.pop()!! as ASTValue;
                assert(leftLambda.type === "lambda");
                const newChild = replaceVar(
                  leftLambda.child,
                  (leftLambda as ASTLambda).value as number,
                  rightValue
                ) as ASTLambda;

                unreduced.push(newChild);
                break;

              case "lazy-apply":
                throw new Error("lazy-apply not implemented");

              case "strict-apply":
                throw new Error("strict-apply not implemented");
            }
        }
      } else {
        break;
      }
    }
  }

  return values.pop()!! as ASTNode;
};

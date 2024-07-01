import { ASTLambda, ASTNode, ASTValue } from "../src/parse";
import {
  alienIntegerToHumanInteger,
  alienStringToHumanString,
  humanIntegerToAlienInteger,
  humanStringToAlienString,
} from "../src/util";

export type Result =
  | {
      type: "string";
      value: string;
    }
  | { type: "integer"; value: number }
  | { type: "boolean"; value: boolean }
  | ASTNode;

type Env = { [key: number]: ASTNode };

export const replaceVar = (
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
  // console.log("");
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

export const evaluateAST = (node: ASTNode, env: Env = {}): ASTNode => {
  // if (root != null) {
  //   logAST(node);
  //   console.log("");
  // }

  switch (node.type) {
    case "string":
      return node;
    case "integer":
      return node;
    case "boolean":
      return node;
    case "lambda":
      return node;
    case "variable":
      return node;
    case "if":
      // logAST(node);
      if ((evaluateAST(node.condition, env) as ASTValue).value as boolean) {
        return evaluateAST(node.then, env);
      } else {
        return evaluateAST(node.else, env);
      }
    case "unary":
      const child = evaluateAST(node.child, env) as ASTValue;
      switch (node.value) {
        case "negate":
          return {
            type: "integer",
            value: -1 * (child.value as number),
          };
        case "not":
          return { type: "boolean", value: !(child.value as boolean) };
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
      }
    case "binary":
      switch (node.value) {
        case "add":
          return {
            type: "integer",
            value:
              ((evaluateAST(node.left, env) as ASTValue).value as number) +
              ((evaluateAST(node.right, env) as ASTValue).value as number),
          };
        case "subtract":
          return {
            type: "integer",
            value:
              ((evaluateAST(node.left, env) as ASTValue).value as number) -
              ((evaluateAST(node.right, env) as ASTValue).value as number),
          };
        case "mult":
          return {
            type: "integer",
            value:
              ((evaluateAST(node.left, env) as ASTValue).value as number) *
              ((evaluateAST(node.right, env) as ASTValue).value as number),
          };
        case "div":
          const divVal =
            ((evaluateAST(node.left, env) as ASTValue).value as number) /
            ((evaluateAST(node.right, env) as ASTValue).value as number);
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
            value:
              ((evaluateAST(node.left, env) as ASTValue).value as number) %
              ((evaluateAST(node.right, env) as ASTValue).value as number),
          };
        case "lt":
          return {
            type: "boolean",
            value:
              ((evaluateAST(node.left, env) as ASTValue).value as number) <
              ((evaluateAST(node.right, env) as ASTValue).value as number),
          };
        case "gt":
          return {
            type: "boolean",
            value:
              ((evaluateAST(node.left, env) as ASTValue).value as number) >
              ((evaluateAST(node.right, env) as ASTValue).value as number),
          };
        case "equal":
          return {
            type: "boolean",
            value:
              (evaluateAST(node.left, env) as ASTValue).value ==
              (evaluateAST(node.right, env) as ASTValue).value,
          };
        case "or":
          return {
            type: "boolean",
            value:
              ((evaluateAST(node.left, env) as ASTValue).value as boolean) ||
              ((evaluateAST(node.right, env) as ASTValue).value as boolean),
          };
        case "and":
          return {
            type: "boolean",
            value:
              ((evaluateAST(node.left, env) as ASTValue).value as boolean) &&
              ((evaluateAST(node.right, env) as ASTValue).value as boolean),
          };
        case "string-concat":
          const value =
            ((evaluateAST(node.left, env) as ASTValue).value as string) +
            ((evaluateAST(node.right, env) as ASTValue).value as string);
          return {
            type: "string",
            value,
          };
        case "take":
          return {
            type: "string",
            value: (
              (evaluateAST(node.right, env) as ASTValue).value as string
            ).slice(
              0,
              (evaluateAST(node.left, env) as ASTValue).value as number
            ),
          };
        case "drop":
          return {
            type: "string",
            value: (
              (evaluateAST(node.right, env) as ASTValue).value as string
            ).slice((evaluateAST(node.left, env) as ASTValue).value as number),
          };
        case "apply":
          let left = node.left;
          if (left.type !== "lambda") {
            left = evaluateAST(node.left, env) as ASTLambda;
          }

          const newChild = replaceVar(
            left.child,
            (left as ASTLambda).value as number,
            node.right
          ) as ASTLambda;
          left = {
            ...left,
            child: newChild,
          };

          return evaluateAST(left.child, env);

        case "lazy-apply":
          throw new Error("lazy-apply not implemented");

        case "strict-apply":
          throw new Error("strict-apply not implemented");
      }
  }
};

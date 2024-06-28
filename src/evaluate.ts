import { ASTNode } from "./parse";
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
  | { type: "boolean"; value: boolean };

type Env = { [key: number]: ASTNode };

export const evaluate = (
  node: ASTNode,
  env: Env = {},
  lambdaArguments: ASTNode[] = []
): Result => {
  switch (node.type) {
    case "string":
      return node;
    case "integer":
      return node;
    case "boolean":
      return node;
    case "lambda":
      if (lambdaArguments.length === 0) {
        throw new Error("Lambda called without arguments");
      }
      return evaluate(
        node.child,
        {
          ...env,
          [node.value as number]: lambdaArguments[0],
        },
        lambdaArguments.slice(1)
      );

    case "variable":
      if (env[node.value as number] === undefined) {
        throw new Error("Variable not defined");
      }
      return evaluate(env[node.value as number], env);

    case "if":
      if (evaluate(node.condition, env).value as boolean) {
        return evaluate(node.then, env);
      } else {
        return evaluate(node.else, env);
      }
    case "unary":
      const child = evaluate(node.child, env);
      switch (node.value) {
        case "negate":
          return { type: "integer", value: -1 * (child.value as number) };
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
              (evaluate(node.left, env).value as number) +
              (evaluate(node.right, env).value as number),
          };
        case "subtract":
          return {
            type: "integer",
            value:
              (evaluate(node.left, env).value as number) -
              (evaluate(node.right, env).value as number),
          };
        case "mult":
          return {
            type: "integer",
            value:
              (evaluate(node.left, env).value as number) *
              (evaluate(node.right, env).value as number),
          };
        case "div":
          const divVal =
            (evaluate(node.left, env).value as number) /
            (evaluate(node.right, env).value as number);
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
              (evaluate(node.left, env).value as number) %
              (evaluate(node.right, env).value as number),
          };
        case "lt":
          return {
            type: "boolean",
            value:
              (evaluate(node.left, env).value as number) <
              (evaluate(node.right, env).value as number),
          };
        case "gt":
          return {
            type: "boolean",
            value:
              (evaluate(node.left, env).value as number) >
              (evaluate(node.right, env).value as number),
          };
        case "equal":
          return {
            type: "boolean",
            value:
              evaluate(node.left, env).value ===
              evaluate(node.right, env).value,
          };
        case "or":
          return {
            type: "boolean",
            value:
              (evaluate(node.left, env).value as boolean) ||
              (evaluate(node.right, env).value as boolean),
          };
        case "and":
          return {
            type: "boolean",
            value:
              (evaluate(node.left, env).value as boolean) &&
              (evaluate(node.right, env).value as boolean),
          };
        case "string-concat":
          return {
            type: "string",
            value:
              (evaluate(node.left, env).value as string) +
              (evaluate(node.right, env).value as string),
          };
        case "take":
          return {
            type: "string",
            value: (evaluate(node.right, env).value as string).slice(
              0,
              evaluate(node.left, env).value as number
            ),
          };
        case "drop":
          return {
            type: "string",
            value: (evaluate(node.right, env).value as string).slice(
              evaluate(node.left, env).value as number
            ),
          };
        case "apply":
          return evaluate(node.left, env, [node.right].concat(lambdaArguments));
      }
  }
};

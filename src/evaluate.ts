import { log } from "console";
import { ASTNode } from "./parse";
import {
  alienIntegerToHumanInteger,
  alienStringToHumanString,
  humanIntegerToAlienInteger,
  humanStringToAlienString,
  logObject,
} from "./util";

export type Result =
  | {
      type: "string";
      value: string;
    }
  | { type: "integer"; value: number }
  | { type: "boolean"; value: boolean }
  | { type: "lambda"; value: ASTNode };

type Env = { [key: number]: ASTNode };

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
      // console.log("lambda", node.value, lambdaArguments.length, env, "\n\n");
      // if (lambdaArguments.length === 0) {
      //   logObject(node.child);
      //   logObject(env);
      // }

      let result =
        lambdaArguments.length === 0
          ? evaluate(node.child, env, [])
          : evaluate(
              node.child,
              { ...env, [node.value as number]: lambdaArguments[0] },
              lambdaArguments.slice(1)
            );
      return result;

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
          const value =
            (evaluate(node.left, env).value as string) +
            (evaluate(node.right, env).value as string);
          // logObject(evaluate(node.right, env).value as string);
          return {
            type: "string",
            value,
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
          if (node.right == null) {
            throw new Error("apply has no right");
          }
          // logObject(node.right);
          return evaluate(node.left, env, [node.right].concat(lambdaArguments));
      }
  }
};

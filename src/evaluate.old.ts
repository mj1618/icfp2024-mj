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
): { result: Result; arguments: ASTNode[] } => {
  logObject(node);
  logObject(env);
  logObject(lambdaArguments);
  console.log("----");

  switch (node.type) {
    case "string":
    case "integer":
    case "boolean":
      // if (lambdaArguments.length > 0) {
      //   throw new Error("lambdaArguments must be empty");
      // }
      return {
        result: node,
        arguments: lambdaArguments,
      };
    case "lambda":
      if (lambdaArguments.length === 0) {
        throw new Error("lambdaArguments must not be empty");
        // return { type: "lambda", value: node };
      }

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
      console.log(node.value, env[node.value as number]);
      return evaluate(env[node.value as number], env, lambdaArguments);

    case "if":
      const cond = evaluate(node.condition, env, lambdaArguments);
      if (cond.result.value as boolean) {
        return evaluate(node.then, env, cond.arguments);
      } else {
        return evaluate(node.else, env, cond.arguments);
      }
    case "unary":
      const child = evaluate(node.child, env, lambdaArguments);
      switch (node.value) {
        case "negate":
          return {
            result: {
              type: "integer",
              value: -1 * (child.result.value as number),
            },
            arguments: child.arguments,
          };
        case "not":
          return {
            result: {
              type: "boolean",
              value: !(child.result.value as boolean),
            },
            arguments: child.arguments,
          };
        case "string-to-int":
          return {
            result: {
              type: "integer",
              value: alienIntegerToHumanInteger(
                humanStringToAlienString(child.result.value as string)
              ),
            },
            arguments: child.arguments,
          };
        case "int-to-string":
          return {
            result: {
              type: "string",
              value: alienStringToHumanString(
                humanIntegerToAlienInteger(child.result.value as number)
              ),
            },
            arguments: child.arguments,
          };
      }
    case "binary":
      let left: any;
      let right: any;
      if (node.value !== "apply") {
        left = evaluate(node.left, env, lambdaArguments);
        right = evaluate(node.right, env, left.arguments);
      }

      switch (node.value) {
        case "add":
          return {
            result: {
              type: "integer",
              value:
                (left.result.value as number) + (right.result.value as number),
            },
            arguments: right.arguments,
          };
        case "subtract":
          return {
            result: {
              type: "integer",
              value:
                (left.result.value as number) - (right.result.value as number),
            },
            arguments: right.arguments,
          };
        case "mult":
          return {
            result: {
              type: "integer",
              value:
                (left.result.value as number) * (right.result.value as number),
            },
            arguments: right.arguments,
          };
        case "div":
          const divVal =
            (left.result.value as number) / (right.result.value as number);
          if (divVal < 0) {
            return {
              result: {
                type: "integer",
                value: Math.ceil(divVal),
              },
              arguments: right.arguments,
            };
          } else {
            return {
              result: {
                type: "integer",
                value: Math.floor(divVal),
              },
              arguments: right.arguments,
            };
          }
        case "mod":
          return {
            result: {
              type: "integer",
              value:
                (left.result.value as number) % (right.result.value as number),
            },
            arguments: right.arguments,
          };
        case "lt":
          return {
            result: {
              type: "boolean",
              value:
                (left.result.value as number) < (right.result.value as number),
            },
            arguments: right.arguments,
          };
        case "gt":
          return {
            result: {
              type: "boolean",
              value:
                (left.result.value as number) > (right.result.value as number),
            },
            arguments: right.arguments,
          };
        case "equal":
          return {
            result: {
              type: "boolean",
              value:
                (left.result.value as number) == (right.result.value as number),
            },
            arguments: right.arguments,
          };
        case "or":
          return {
            result: {
              type: "boolean",
              value:
                (left.result.value as boolean) ||
                (right.result.value as boolean),
            },
            arguments: right.arguments,
          };
        case "and":
          return {
            result: {
              type: "boolean",
              value:
                (left.result.value as boolean) &&
                (right.result.value as boolean),
            },
            arguments: right.arguments,
          };
        case "string-concat":
          return {
            result: {
              type: "string",
              value:
                (left.result.value as string) + (right.result.value as string),
            },
            arguments: right.arguments,
          };
        case "take":
          return {
            result: {
              type: "string",
              value: (left.result.value as string).slice(
                0,
                right.result.value as number
              ),
            },
            arguments: right.arguments,
          };
        case "drop":
          return {
            result: {
              type: "string",
              value: (left.result.value as string).slice(
                right.result.value as number
              ),
            },
            arguments: right.arguments,
          };
        case "apply":
          if (node.right == null) {
            throw new Error("apply has no right");
          }
          return evaluate(node.left, env, [node.right].concat(lambdaArguments));
      }
  }
};

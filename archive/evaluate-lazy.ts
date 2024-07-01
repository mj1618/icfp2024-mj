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
// export const evaluateStrict = (node: ASTNode: Env = {}): ASTValue => {
//   return (evaluateASTLazyEval(node) as LazyASTNode).value() as ASTValue;
// };

type LazyNode = {
  lazyType: "node";
  type: string;
  node: ASTNode;
};

type LazyWrapper =
  | {
      lazyType: "lazy";
      type: string;
      reduce: () => LazyWrapper;
      reduceFull: () => LazyNode;
    }
  | LazyNode;

const lazyNode = (node: ASTNode): LazyWrapper => {
  return {
    lazyType: "node",
    type: node.type,
    node,
  };
};

const lazyFn = (fn: () => LazyWrapper, type: string): LazyWrapper => {
  return {
    lazyType: "lazy",
    type,
    reduce: () => {
      return fn();
    },
    reduceFull: () => {
      let res = fn();
      while (res.lazyType === "lazy") {
        res = res.reduce();
      }
      return res;
    },
  };
};

export const evaluateASTLazy = (node: ASTNode): ASTNode => {
  root = node;
  let res = evaluateASTLazyEval(lazyNode(node));

  while (res.lazyType === "lazy") {
    res = evaluateASTLazyEval(res);
  }
  return res.node;
};

let root: ASTNode | null = null;

let unwrap = (node: LazyWrapper): LazyNode => {
  if (node.lazyType === "node") {
    return node;
  } else {
    return node.reduceFull();
  }
};

export const evaluateASTLazyEval = (lazyNode: LazyWrapper): LazyWrapper => {
  // if (root != null) {
  //   logAST(node);
  //   console.log("");
  // }
  switch (lazyNode.type) {
    case "string":
    case "integer":
    case "boolean":
    case "lambda":
    case "variable":
      return lazyNode;
    case "if":
      if ((evaluateASTLazyEval(node.condition) as ASTValue).value as boolean) {
        return evaluateASTLazyEval(node.then);
      } else {
        return evaluateASTLazyEval(node.else);
      }
    case "unary":
      const child = evaluateASTLazyEval(node.child) as ASTValue;
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
              ((evaluateASTLazyEval(evaluateASTLazyEval(node.left)) as ASTValue)
                .value as number) +
              ((
                evaluateASTLazyEval(evaluateASTLazyEval(node.right)) as ASTValue
              ).value as number),
          };
        case "subtract":
          return {
            type: "integer",
            value:
              ((evaluateASTLazyEval(node.left) as ASTValue).value as number) -
              ((evaluateASTLazyEval(node.right) as ASTValue).value as number),
          };
        case "mult":
          return {
            type: "integer",
            value:
              ((evaluateASTLazyEval(node.left) as ASTValue).value as number) *
              ((evaluateASTLazyEval(node.right) as ASTValue).value as number),
          };
        case "div":
          const divVal =
            ((evaluateASTLazyEval(node.left) as ASTValue).value as number) /
            ((evaluateASTLazyEval(node.right) as ASTValue).value as number);
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
              ((evaluateASTLazyEval(node.left) as ASTValue).value as number) %
              ((evaluateASTLazyEval(node.right) as ASTValue).value as number),
          };
        case "lt":
          return {
            type: "boolean",
            value:
              ((evaluateASTLazyEval(node.left) as ASTValue).value as number) <
              ((evaluateASTLazyEval(node.right) as ASTValue).value as number),
          };
        case "gt":
          return {
            type: "boolean",
            value:
              ((evaluateASTLazyEval(node.left) as ASTValue).value as number) >
              ((evaluateASTLazyEval(node.right) as ASTValue).value as number),
          };
        case "equal":
          return {
            type: "boolean",
            value:
              (evaluateASTLazyEval(node.left) as ASTValue).value ==
              (evaluateASTLazyEval(node.right) as ASTValue).value,
          };
        case "or":
          return {
            type: "boolean",
            value:
              ((evaluateASTLazyEval(node.left) as ASTValue).value as boolean) ||
              ((evaluateASTLazyEval(node.right) as ASTValue).value as boolean),
          };
        case "and":
          return {
            type: "boolean",
            value:
              ((evaluateASTLazyEval(node.left) as ASTValue).value as boolean) &&
              ((evaluateASTLazyEval(node.right) as ASTValue).value as boolean),
          };
        case "string-concat":
          const value =
            ((evaluateASTLazyEval(node.left) as ASTValue).value as string) +
            ((evaluateASTLazyEval(node.right) as ASTValue).value as string);
          return {
            type: "string",
            value,
          };
        case "take":
          return {
            type: "string",
            value: (
              (evaluateASTLazyEval(node.right) as ASTValue).value as string
            ).slice(
              0,
              (evaluateASTLazyEval(node.left) as ASTValue).value as number
            ),
          };
        case "drop":
          return {
            type: "string",
            value: (
              (evaluateASTLazyEval(node.right) as ASTValue).value as string
            ).slice(
              (evaluateASTLazyEval(node.left) as ASTValue).value as number
            ),
          };
        case "apply":
          return {
            type: "binary",
            value: "strict-apply",
            node: Object.assign(
              {},
              {
                ...node,
                value: "strict-apply",
              }
            ),
          };

        case "lazy-apply":
          // return {
          //   type: "binary",
          //   value: "strict-apply",
          //   node: Object.assign(
          //     {},
          //     {
          //       ...node,
          //       value: "apply",
          //     }
          //   ),
          // };
          throw new Error("lazy-apply not implemented");

        case "strict-apply":
          const strictNode = node.node;
          let left = strictNode.left;
          if (left.type !== "lambda") {
            left = evaluateASTLazyEval(strictNode.left) as ASTLambda;
          }

          const newChild = replaceVar(
            left.child,
            (left as ASTLambda).value as number,
            strictNode.right
          ) as ASTLambda;
          left = {
            ...left,
            child: newChild,
          };

          return evaluateASTLazyEval(left.child);
      }
  }
};

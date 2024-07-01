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
  let stack = [{ node: node, env: env }];
  let result: ASTNode | null = null;

  while (stack.length > 0) {
    const popped = stack.pop();
    if (!popped) continue;
    let { node, env } = popped;

    switch (node.type) {
      case "string":
      case "integer":
      case "boolean":
      case "lambda":
      case "variable":
        result = node;
        break;
      
      case "if":
        const conditionValue = (evaluateAST(node.condition, env) as ASTValue).value as boolean;
        stack.push({ node: conditionValue ? node.then : node.else, env: env });
        break;

      case "unary":
        const child = evaluateAST(node.child, env) as ASTValue;
        switch (node.value) {
          case "negate":
            result = { type: "integer", value: -1 * (child.value as number) };
            break;
          case "not":
            result = { type: "boolean", value: !(child.value as boolean) };
            break;
          case "string-to-int":
            result = {
              type: "integer",
              value: alienIntegerToHumanInteger(humanStringToAlienString(child.value as string))
            };
            break;
          case "int-to-string":
            result = {
              type: "string",
              value: alienStringToHumanString(humanIntegerToAlienInteger(child.value as number))
            };
            break;
        }
        break;

      case "binary":
        const left = evaluateAST(node.left, env) as ASTValue;
        const right = evaluateAST(node.right, env) as ASTValue;
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
            result = calculateBinaryOperation(node.value, left, right);
            break;
          case "string-concat":
          case "take":
          case "drop":
            result = calculateStringOperation(node.value, left, right);
            break;
          case "apply":
            // Apply logic here
            break;
          case "lazy-apply":
          case "strict-apply":
            throw new Error(`${node.value} not implemented`);
            break;
        }
        break;
    }

    if (stack.length === 0) {
      if (result === null) {
        throw new Error("Evaluation failed: result is null.");
      }
      return result;
    }
  }
  throw new Error("Evaluation failed: result is null.");
};

function calculateBinaryOperation(operator: string, left: ASTValue, right: ASTValue): ASTNode {
  switch (operator) {
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
      // Handling division, considering integer division rules:
      const divResult = (left.value as number) / (right.value as number);
      return {
        type: "integer",
        value: divResult < 0 ? Math.ceil(divResult) : Math.floor(divResult),
      };
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
        value: left.value === right.value,
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
    default:
      throw new Error(`Unsupported binary operation: ${operator}`);
  }
}

function calculateStringOperation(operator: string, left: ASTValue, right: ASTValue): ASTNode {
  switch (operator) {
    case "string-concat":
      return {
        type: "string",
        value: (left.value as string) + (right.value as string),
      };
    case "take":
      // The 'take' operation should take the first 'left.value' number of characters from 'right.value'
      return {
        type: "string",
        value: (right.value as string).substring(0, left.value as number),
      };
    case "drop":
      // The 'drop' operation should drop the first 'left.value' number of characters from 'right.value'
      return {
        type: "string",
        value: (right.value as string).substring(left.value as number),
      };
    default:
      throw new Error(`Unsupported string operation: ${operator}`);
  }
}

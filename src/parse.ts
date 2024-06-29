import { Token } from "./constants";

export type ASTNode = { id: number } & (
  | {
      type: "integer";
      value: number;
    }
  | {
      type: "string";
      value: string;
    }
  | {
      type: "unary";
      value: "negate" | "not" | "string-to-int" | "int-to-string";
      child: ASTNode;
    }
  | {
      type: "binary";
      value:
        | "add"
        | "subtract"
        | "mult"
        | "div"
        | "mod"
        | "lt"
        | "gt"
        | "equal"
        | "or"
        | "and"
        | "string-concat"
        | "take"
        | "drop"
        | "apply"
        | "lazy-apply"
        | "strict-apply";
      left: ASTNode;
      right: ASTNode;
    }
  | {
      type: "boolean";
      value: boolean;
    }
  | {
      type: "if";
      condition: ASTNode;
      then: ASTNode;
      else: ASTNode;
    }
  | {
      type: "lambda";
      value: number;
      child: ASTNode;
    }
  | {
      type: "variable";
      value: number;
    }
);

export const parse = (
  tokens: Token[],
  fromIndex = 0
): ASTNode & { newFromIndex: number } => {
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
      const child = parse(tokens, fromIndex + 1);
      return { ...curr, child, newFromIndex: child.newFromIndex, id };
    case "binary":
      const left = parse(tokens, fromIndex + 1);
      const right = parse(tokens, left.newFromIndex);
      return { ...curr, left, right, newFromIndex: right.newFromIndex, id };
    case "if":
      const condition = parse(tokens, fromIndex + 1);
      const then = parse(tokens, condition.newFromIndex);
      const elseNode = parse(tokens, then.newFromIndex);
      return {
        type: "if",
        condition,
        then,
        else: elseNode,
        newFromIndex: elseNode.newFromIndex,
        id,
      };
    case "lambda":
      const lamChild = parse(tokens, fromIndex + 1);
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

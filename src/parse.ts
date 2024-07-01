import { Token } from "./constants";

export type ASTValue =
  | {
      type: "integer";
      value: number;
    }
  | {
      type: "string";
      value: string;
    }
  | {
      type: "boolean";
      value: boolean;
    }
  | {
      type: "variable";
      value: number;
    };
export type ASTLambda = {
  type: "lambda";
  value: number;
  child: ASTNode;
};

export type ASTNode = { id?: number; parentId?: number } & (
  | ASTValue
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
      type: "if";
      condition: ASTNode;
      then: ASTNode;
      else: ASTNode;
    }
  | ASTLambda
  | {
      type: "variable";
      value: number;
    }
);

export const parse = (
  tokens: Token[],
  fromIndex = 0,
  parentId: number = -1
): ASTNode & { newFromIndex: number } => {
  const curr = tokens[fromIndex];
  const id = fromIndex;
  switch (curr.type) {
    case "string":
      return { ...curr, newFromIndex: fromIndex + 1, id, parentId };
    case "integer":
      return { ...curr, newFromIndex: fromIndex + 1, id, parentId };
    case "boolean":
      return { ...curr, newFromIndex: fromIndex + 1, id, parentId };
    case "unary":
      const child = parse(tokens, fromIndex + 1, fromIndex);
      return { ...curr, child, newFromIndex: child.newFromIndex, id, parentId };
    case "binary":
      const left = parse(tokens, fromIndex + 1, fromIndex);
      const right = parse(tokens, left.newFromIndex, fromIndex);
      return {
        ...curr,
        left,
        right,
        newFromIndex: right.newFromIndex,
        id,
        parentId,
      };
    case "if":
      const condition = parse(tokens, fromIndex + 1, fromIndex);
      const then = parse(tokens, condition.newFromIndex, fromIndex);
      const elseNode = parse(tokens, then.newFromIndex, fromIndex);
      return {
        type: "if",
        condition,
        then,
        else: elseNode,
        newFromIndex: elseNode.newFromIndex,
        id,
        parentId,
      };
    case "lambda":
      const lamChild = parse(tokens, fromIndex + 1, fromIndex);
      return {
        ...curr,
        child: lamChild,
        newFromIndex: lamChild.newFromIndex,
        id,
        parentId,
      };
    case "variable":
      return { ...curr, newFromIndex: fromIndex + 1, id, parentId };
  }
};

import { Token, binaryMap, unaryMap } from "./constants";
import { alienIntegerToHumanInteger, alienStringToHumanString } from "./util";

const tokenizeString = (source: string): Token => {
  return { type: "string", value: alienStringToHumanString(source) };
};

const tokenizeInteger = (source: string): Token => {
  return { type: "integer", value: alienIntegerToHumanInteger(source) };
};

const tokenizeUnary = (source: string): Token => {
  return {
    type: "unary",
    value: unaryMap[source.charAt(0) as keyof typeof unaryMap],
  };
};

const tokenizeBinary = (source: string): Token => {
  return {
    type: "binary",
    value: binaryMap[source.charAt(0) as keyof typeof binaryMap],
  };
};

const tokenizeLambda = (source: string): Token => {
  return {
    type: "lambda",
    value: alienIntegerToHumanInteger(source),
  };
};
const tokenizeVariable = (source: string): Token => {
  return {
    type: "variable",
    value: alienIntegerToHumanInteger(source),
  };
};

export const tokenize = (original: string): Token[] => {
  const sources = original.split(" ");
  return sources.map((source) => {
    if (source.charAt(0) === "S") {
      return tokenizeString(source.slice(1));
    } else if (source.charAt(0) === "I") {
      return tokenizeInteger(source.slice(1));
    } else if (source.charAt(0) === "U") {
      return tokenizeUnary(source.slice(1));
    } else if (source.charAt(0) === "B") {
      return tokenizeBinary(source.slice(1));
    } else if (source.charAt(0) === "?") {
      return { type: "if" };
    } else if (source.charAt(0) === "L") {
      return tokenizeLambda(source.slice(1));
    } else if (source.charAt(0) === "v") {
      return tokenizeVariable(source.slice(1));
    } else if (source.charAt(0) === "T") {
      return { type: "boolean", value: true };
    } else if (source.charAt(0) === "F") {
      return { type: "boolean", value: false };
    } else {
      throw new Error("Unknown token: " + source);
    }
  });
};

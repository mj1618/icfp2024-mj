// lam(x, mult(x, 2))

import { humanIntegerToAlienInteger, humanStringToAlienString } from "./util";

type DslBoolean = {
  type: "boolean";
  value: boolean;
};

type DslInt = {
  type: "int";
  value: number;
};

type DslString = {
  type: "string";
  value: string;
};

type DslVar = {
  type: "var";
  name: string;
};

type DslIf = {
  type: "if";
  cond: Dsl;
  then: Dsl;
  else: Dsl;
};

type DslLambda = {
  type: "lambda";
  arg: string;
  body: Dsl;
};

type DslValue = DslBoolean | DslInt | DslString;

type DslUnary = {
  type: "unary";
  value: Dsl;
  operator: string;
};

type DslBinary = {
  type: "binary";
  left: Dsl;
  right: Dsl;
  operator: string;
};

export type Dsl = DslValue | DslUnary | DslBinary | DslIf | DslLambda | DslVar;

export const binaryOpToString = (op: string) => {
  switch (op) {
    case "+":
      return "add";
    case "-":
      return "sub";
    case "*":
      return "mult";
    case "/":
      return "div";
    case "%":
      return "mod";
    case "<":
      return "lt";
    case ">":
      return "gt";
    case "=":
      return "eq";
    case "|":
      return "or";
    case "&":
      return "and";
    case ".":
      return "concat";
    case "T":
      return "take";
    case "D":
      return "drop";
    case "$":
      return "apply";
    default:
      return "";
  }
};

export const unaryOpToString = (op: string) => {
  switch (op) {
    case "-":
      return "neg";
    case "!":
      return "not";
    case "#":
      return "stringToInt";
    case "$":
      return "intToString";
    default:
      return "";
  }
};

export const T: DslValue = {
  type: "boolean",
  value: true,
};
export const F: DslValue = {
  type: "boolean",
  value: false,
};

export const str = (s: string): DslValue => {
  return {
    type: "string",
    value: s,
  };
};

export const int = (n: number): DslValue => {
  return {
    type: "int",
    value: n,
  };
};

export const createUnary = (a: Dsl, op: string): DslUnary => {
  return {
    type: "unary",
    value: a,
    operator: op,
  };
};

export const neg = (a: Dsl): DslUnary => {
  return createUnary(a, "-");
};

export const not = (a: Dsl): DslUnary => {
  return createUnary(a, "!");
};

export const stringToInt = (a: Dsl): DslUnary => {
  return createUnary(a, "#");
};

export const intToString = (a: Dsl): DslUnary => {
  return createUnary(a, "$");
};

export const createBinary = (a: Dsl, b: Dsl, op: string): DslBinary => {
  return {
    type: "binary",
    left: a,
    right: b,
    operator: op,
  };
};

export const add = (a: Dsl, b: Dsl): DslBinary => {
  return createBinary(a, b, "+");
};

export const sub = (a: Dsl, b: Dsl): DslBinary => {
  return createBinary(a, b, "-");
};

export const mult = (a: Dsl, b: Dsl): DslBinary => {
  return createBinary(a, b, "*");
};

export const div = (a: Dsl, b: Dsl): DslBinary => {
  return createBinary(a, b, "/");
};

export const mod = (a: Dsl, b: Dsl): DslBinary => {
  return createBinary(a, b, "%");
};

export const lt = (a: Dsl, b: Dsl): DslBinary => {
  return createBinary(a, b, "<");
};

export const gt = (a: Dsl, b: Dsl): DslBinary => {
  return createBinary(a, b, ">");
};

export const eq = (a: Dsl, b: Dsl): DslBinary => {
  return createBinary(a, b, "=");
};

export const or = (a: Dsl, b: Dsl): DslBinary => {
  return createBinary(a, b, "|");
};
export const and = (a: Dsl, b: Dsl): DslBinary => {
  return createBinary(a, b, "&");
};

export const concat = (a: Dsl, b: Dsl): DslBinary => {
  return createBinary(a, b, ".");
};

export const take = (a: Dsl, b: Dsl): DslBinary => {
  return createBinary(a, b, "T");
};

export const drop = (a: Dsl, b: Dsl): DslBinary => {
  return createBinary(a, b, "D");
};

export const apply = (a: Dsl, ...args: Dsl[]): Dsl => {
  return args.reduce((acc, arg) => createBinary(acc, arg, "$"), a);
};

export const ifThenElse = (arg: { cond: Dsl; then: Dsl; else: Dsl }): DslIf => {
  return {
    type: "if",
    ...arg,
  };
};
export const lam = (arg: string, body: Dsl): DslLambda => {
  return {
    type: "lambda",
    arg,
    body,
  };
};

export const var_ = (name: string): DslVar => {
  return {
    type: "var",
    name,
  };
};

export const a = "a",
  b = "b",
  c = "c",
  d = "d",
  e = "e",
  f = "f",
  g = "g",
  h = "h",
  i = "i",
  j = "j",
  k = "k",
  l = "l",
  m = "m",
  n = "n",
  o = "o",
  p = "p",
  q = "q",
  r = "r",
  s = "s",
  t = "t",
  u = "u",
  v = "v",
  w = "w",
  x = "x",
  y = "y",
  z = "z";

export const S = lam(
  x,
  lam(y, lam(z, apply(apply(var_(x), var_(z)), apply(var_(y), var_(z)))))
);

export const K = lam(x, lam(y, var_(x)));

export const I = lam(x, var_(x));

export const B = lam(
  x,
  lam(y, lam(z, apply(var_(x), apply(var_(y), var_(z)))))
);

export const C = lam(
  x,
  lam(y, lam(z, apply(apply(var_(x), var_(z)), var_(y))))
);

export const W = lam(x, lam(y, apply(apply(var_(x), var_(y)), var_(y))));

export const Y = (fn: Dsl) =>
  apply(
    lam(
      f,
      apply(
        lam(x, apply(var_(f), apply(var_(x), var_(x)))),
        lam(x, apply(var_(f), apply(var_(x), var_(x))))
      )
    ),
    fn
  );

export const fn = (args: string[], body: () => Dsl): Dsl => {
  return args.reduceRight((acc, arg) => lam(arg, acc), body());
};

export const call = (fn: Dsl, ...args: Dsl[]): Dsl => {
  return args.reduce((acc, arg) => apply(acc, arg), fn);
};

export const compileDsl = (
  dsl: Dsl,
  varMapping: { [key: string]: number },
  varNumber: number
): string => {
  switch (dsl.type) {
    case "boolean":
      return dsl.value ? "T" : "F";
    case "int":
      return `I${humanIntegerToAlienInteger(dsl.value)}`;
    case "string":
      return `S${humanStringToAlienString(dsl.value)}`;
    case "var":
      return `v${varMapping[dsl.name]}`;
    case "unary":
      return `U${dsl.operator} ${compileDsl(dsl.value, varMapping, varNumber)}`;
    case "binary":
      return `B${dsl.operator} ${compileDsl(
        dsl.left,
        varMapping,
        varNumber
      )} ${compileDsl(dsl.right, varMapping, varNumber)}`;
    case "if":
      return `? ${compileDsl(dsl.cond, varMapping, varNumber)} ${compileDsl(
        dsl.then,
        varMapping,
        varNumber
      )} ${compileDsl(dsl.else, varMapping, varNumber)}`;
    case "lambda":
      return `L${varNumber} ${compileDsl(
        dsl.body,
        { ...varMapping, [dsl.arg]: varNumber },
        varNumber + 1
      )}`;
  }
};

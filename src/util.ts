import { compileString } from "./compile";
import { alienChars } from "./constants";
import { evaluate } from "./evaluate";
import { tokenize } from "./lex";
import { parse } from "./parse";
const util = require("util");

const token = "1c424ec1-904c-4ebc-bda0-deaa2d02c95d";

export const send = async (body: string) => {
  const response = await fetch("https://boundvariable.space/communicate", {
    method: "POST",
    body: body,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.status, response.statusText);
  const data = await response.text();

  return data;
};

export const humanStringToAlienString = (source: string): string => {
  let result = "";
  for (let i = 0; i < source.length; i++) {
    result += String.fromCharCode(alienChars.indexOf(source.charAt(i)) + 33);
  }
  return result;
};

export const humanIntegerToAlienInteger = (source: number): string => {
  let result = "";
  while (source > 0) {
    result = String.fromCharCode((source % 94) + 33) + result;
    source = Math.floor(source / 94);
  }
  return result;
};

export const alienStringToHumanString = (source: string): string => {
  let result = "";
  for (let i = 0; i < source.length; i++) {
    result += alienChars.charAt(source.charCodeAt(i) - 33);
  }
  return result;
};

export const alienIntegerToHumanInteger = (source: string): number => {
  let result = 0;
  for (let i = 0; i < source.length; i++) {
    result += (source.charCodeAt(i) - 33) * Math.pow(94, source.length - i - 1);
  }
  return result;
};

export const logObject = (obj: Object) => {
  console.log(
    util.inspect(obj, {
      showHidden: false,
      depth: null,
      colors: true,
    })
  );
};

export const sendRawToServer = async (source: string) => {
  const response = await send(source);
  console.log(response);
  logObject(evaluate(parse(tokenize(response))));
  return evaluate(parse(tokenize(response)));
};

export const sendToServer = async (source: string) => {
  const response = await send(compileString(source));
  console.log(response);
  logObject(evaluate(parse(tokenize(response))));
  return evaluate(parse(tokenize(response)));
};

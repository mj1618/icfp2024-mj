import { compileString } from "./compile";
import { language_test } from "./constants";
import { evaluate } from "./evaluate";
import { tokenize } from "./lex";
import { parse } from "./parse";
import { logObject, send } from "./util";

export const sendRawToServer = async (source: string) => {
  const response = await send(source);
  console.log(response);
  logObject(evaluate(parse(tokenize(response))));
};

export const sendToServer = async (source: string) => {
  const response = await send(compileString(source));
  console.log(response);
  logObject(evaluate(parse(tokenize(response))));
};

export const main = async () => {
  await sendToServer("get lambdaman");
  // await sendToServer("solve language_test 4w3s0m3");

  const res = evaluate(parse(tokenize(language_test)));
  logObject(res);
};

main();

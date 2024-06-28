import { compileString } from "./compile";
import { evaluate } from "./evaluate";
import { solveLambdaMan } from "./lambdaman";
import { tokenize } from "./lex";
import { parse } from "./parse";
import { logObject, send } from "./util";

export const main = async () => {
  for (let i = 6; i <= 50; i++) {
    await solveLambdaMan(i);
  }

  // await sendToServer("solve language_test 4w3s0m3");

  // const res = evaluate(parse(tokenize(language_test)));
  // logObject(res);
};

main();

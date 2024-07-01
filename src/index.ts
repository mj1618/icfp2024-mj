import { solveLambdaMan2 } from "./lambdaman2";
import { solveLambdaMan } from "./lambdaman";
import { sendToServer } from "./util";

export const main = async () => {
  // console.log(evaluate(parse(tokenize(`I-`))));
  // for (let i = 11; i <= 11; i++) {
  //   try {
  //     await solveLambdaMan(i);
  //     console.log("Solved: ", i);
  //   } catch (e) {
  //     console.log("Could not solve: ", i);
  //     console.error(e);
  //   }
  // }
  // await sendToServerLazy("get efficiency1");
  // for (let i = 23; i <= 23; i++) {
  //   try {
  //     await solveSpaceship(i);
  //     console.log("Solved: ", i);
  //   } catch (e) {
  //     console.log("Could not solve: ", i);
  //     console.error(e);
  //   }
  // }
  // await sendToServer(`solve efficiency6 ${solve6()}`);
  // await sendToServer(`solve efficiency7 1`);
  // await sendToServer(`solve efficiency7 41`);
  // await sendToServer(
  //   `solve lambdaman3 DRDRLLLUDLLUURURLLURLUURRRRRDDDDULULULRRD`
  // );
  // DRDRDRLLLUDLLUURURLLURLURRRRRDDDDULULULRRD

  console.log((await sendToServer(`get lambdaman11`)).value);
  // logAST()
  // B$ L! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! I" L! B+ B+ v! v! B+ v! v!
  // await sendRawToServer(`B. ${compileString("solve efficiency1 ")} U$ I"`);
  // B$ L! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! B$ v! I" L! B+ B+ v! v! B+ v! v!
  // console.log(
  //   evaluate(parse(tokenize(`B$ L! B$ v! I" L! B+ B+ v! v! B+ v! v!`))).value
  // );
  // await solveLambdaMan(3);
  // const expr = `B. B$ L" B. v" v" B$ L" B. v" v" B$ L" B. v" v" B$ L" B. v" v" B$ L" B. v" v" SLLLLLL SLLLLLLL`;
  // console.log(`B. ${compileString("solve lambdaman6 ")} ${expr}`);
  // await sendRawToServer(`${compileString("solve efficiency1 0")}`);
  // await sendRawToServer(`${compileString("solve efficiency2 2134")}`);
  // await sendRawToServer(`${compileString("solve efficiency3 9345875634")}`);
  // await sendRawToServer(`${compileString(`solve efficiency4 ${solve(40)}`)}`);
  // await sendRawToServer(`B. ${compileString("solve lambdaman6 ")} ${expr}`);
  // const res = evaluate(
  //   parse(
  //     tokenize(
  //       `B. SF B$ B$ L" B$ L" B$ L# B$ v" B$ v# v# L# B$ v" B$ v# v# L$ L# ? B= v# I" v" B. v" B$ v$ B- v# I" Sl I#,`
  //     )
  //   )
  // ).value;
  // logObject(res);
};

main();

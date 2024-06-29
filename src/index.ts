import { solveLambdaMan } from "./lambdaman";
import { solveSpaceship } from "./spaceship";
import { sendToServer } from "./util";

export const main = async () => {
  for (let i = 13; i <= 13; i++) {
    try {
      await solveLambdaMan(i);
      console.log("Solved: ", i);
    } catch (e) {
      console.log("Could not solve: ", i);
      console.error(e);
    }
  }
  // await sendToServer("get efficiency4");
  // for (let i = 25; i <= 25; i++) {
  //   try {
  //     await solveSpaceship(i);
  //     console.log("Solved: ", i);
  //   } catch (e) {
  //     console.log("Could not solve: ", i);
  //     console.error(e);
  //   }
  // }

  // await sendToServer("get spaceship");
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

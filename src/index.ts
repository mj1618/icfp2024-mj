import { solveLambdaMan } from "./lambdaman";

export const main = async () => {
  for (let i = 21; i <= 21; i++) {
    try {
      await solveLambdaMan(i);
      console.log("Solved: ", i);
    } catch (e) {
      console.log("Could not solve: ", i);
    }
  }

  // await sendToServer("solve language_test 4w3s0m3");

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

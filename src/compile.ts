import { alienChars } from "./constants";

export const compileString = (str: string) => {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(alienChars.indexOf(str.charAt(i)) + 33);
  }
  return "S" + result;
};

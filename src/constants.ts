export const input1 = `get index`; // `S'%4}).$%8`;
export const output1 = `SB%,,/}!.$}7%,#/-%}4/}4(%}M#(//,}/&}4(%}</5.$}P!2)!",%_~~<%&/2%}4!+).'}!}#/523%j}7%}35''%34}4(!4}9/5}(!6%}!},//+}!2/5.$l}S/5e2%}./7},//+).'}!4}4(%}u).$%8wl}N/}02!#4)#%}9/52}#/--5.)#!4)/.}3+),,3j}9/5}#!.}53%}/52}u%#(/w}3%26)#%l}@524(%2-/2%j}4/}+./7}(/7}9/5}!.$}/4(%2}345$%.43}!2%}$/).'j}9/5}#!.},//+}!4}4(%}u3#/2%"/!2$wl~~;&4%2},//+).'}!2/5.$j}9/5}-!9}"%}!$-)44%$}4/}9/52}&)234}#/523%3j}3/}-!+%}352%}4/}#(%#+}4()3}0!'%}&2/-}4)-%}4/}4)-%l}C.}4(%}-%!.4)-%j})&}9/5}7!.4}4/}02!#4)#%}-/2%}!$6!.#%$}#/--5.)#!4)/.}3+),,3j}9/5}-!9}!,3/}4!+%}/52}u,!.'5!'%y4%34wl~`;
/*
Hello and welcome to the School of the Bound Variable!

Before taking a course, we suggest that you have a look around. You're now looking at the [index]. To practice your communication skills, you can use our [echo] service. Furthermore, to know how you and other students are doing, you can look at the [scoreboard].

After looking around, you may be admitted to your first courses, so make sure to check this page from time to time. In the meantime, if you want to practice more advanced communication skills, you may also take our [language_test].
*/

export const language_test = `? B= B$ B$ B$ B$ L$ L$ L$ L# v$ I" I# I$ I% I$ ? B= B$ L$ v$ I+ I+ ? B= BD I$ S4%34 S4 ? B= BT I$ S4%34 S4%3 ? B= B. S4% S34 S4%34 ? U! B& T F ? B& T T ? U! B| F F ? B| F T ? B< U- I$ U- I# ? B> I$ I# ? B= U- I" B% U- I$ I# ? B= I" B% I( I$ ? B= U- I" B/ U- I$ I# ? B= I# B/ I( I$ ? B= I' B* I# I$ ? B= I$ B+ I" I# ? B= U$ I4%34 S4%34 ? B= U# S4%34 I4%34 ? U! F ? B= U- I$ B- I# I& ? B= I$ B- I& I# ? B= S4%34 S4%34 ? B= F F ? B= I$ I$ ? T B. B. SM%,&k#(%#+}IEj}3%.$}z3/,6%},!.'5!'%y4%34} U$ B+ I# B* I$> I1~s:U@ Sz}4/}#,!)-}0/).43}&/2})4 S)&})3}./4}#/22%#4 S").!29}q})3}./4}#/22%#4 S").!29}q})3}./4}#/22%#4 S").!29}q})3}./4}#/22%#4 S").!29}k})3}./4}#/22%#4 S5.!29}k})3}./4}#/22%#4 S5.!29}_})3}./4}#/22%#4 S5.!29}a})3}./4}#/22%#4 S5.!29}b})3}./4}#/22%#4 S").!29}i})3}./4}#/22%#4 S").!29}h})3}./4}#/22%#4 S").!29}m})3}./4}#/22%#4 S").!29}m})3}./4}#/22%#4 S").!29}c})3}./4}#/22%#4 S").!29}c})3}./4}#/22%#4 S").!29}r})3}./4}#/22%#4 S").!29}p})3}./4}#/22%#4 S").!29}{})3}./4}#/22%#4 S").!29}{})3}./4}#/22%#4 S").!29}d})3}./4}#/22%#4 S").!29}d})3}./4}#/22%#4 S").!29}l})3}./4}#/22%#4 S").!29}N})3}./4}#/22%#4 S").!29}>})3}./4}#/22%#4 S!00,)#!4)/.})3}./4}#/22%#4 S!00,)#!4)/.})3}./4}#/22%#4`;
/*{
  type: 'string',
  value: 'Self-check OK, send `solve language_test 4w3s0m3` to claim points for it'
}
  {
  type: 'string',
  value: 'Correct, you solved hello4!\n',
  newFromIndex: 1
}
  */

export const lambdaMan1 = "###.#...\n...L..##\n.#######\n";

export const alienChars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"#$%&'()*+,-./:;<=>?@[\\]^_\`|~ \n`;

export type TokenInteger = { type: "integer"; value: number };

export type TokenString = { type: "string"; value: string };

export type TokenBoolean = { type: "boolean"; value: boolean };

export type Token =
  | TokenInteger
  | TokenString
  | {
      type: "unary";
      value: "negate" | "not" | "string-to-int" | "int-to-string";
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
    }
  | { type: "boolean"; value: boolean }
  | { type: "if" }
  | { type: "lambda"; value: number }
  | { type: "variable"; value: number };

export const unaryMap: {
  [key: string]: "negate" | "not" | "string-to-int" | "int-to-string";
} = { "-": "negate", "!": "not", "#": "string-to-int", $: "int-to-string" };

export const binaryMap: {
  [key: string]:
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
} = {
  "+": "add",
  "-": "subtract",
  "*": "mult",
  "/": "div",
  "%": "mod",
  "<": "lt",
  ">": "gt",
  "=": "equal",
  "|": "or",
  "&": "and",
  ".": "string-concat",
  T: "take",
  D: "drop",
  $: "apply",
  "~": "lazy-apply",
  "!": "strict-apply",
};

import {readTextBuffer, split} from "../util.ts";
import {getLocalMins} from "./local-min.ts";

const lines = split(readTextBuffer(import.meta.url));

const numbers = lines.map(line => line.split("").map(Number));
const mins = getLocalMins(numbers);

console.log(mins.reduce((previousValue, [p1, p2]) => previousValue + numbers[p1][p2] + 1, 0));
Deno.exit()

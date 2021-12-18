import {readTextBuffer, splitLines} from "../common/util.ts";
import {add, Pair, parsePairs} from "./task18-common.ts";

const lines = splitLines(readTextBuffer(import.meta.url));

const pairs = lines.map(el => parsePairs(el));

let sum: Pair | undefined = undefined;
for (const pair of pairs) {
    sum = sum == undefined ? pair : add(sum, pair);
}

console.log(sum!.toString());
console.log(sum!.magnitude());

import {readTextBuffer, splitLines} from "../common/util.ts";
import {add, Pair, parsePairs} from "./task18-common.ts";

const lines = splitLines(readTextBuffer(import.meta.url));

let maxMag: number | undefined = undefined;
let maxEl: [Pair, Pair] | undefined = undefined;
for (const pair1 of lines) {
    for (const pair2 of lines) {
        if (pair1 == pair2) continue;
        const left = parsePairs(pair1);
        const right = parsePairs(pair2);
        const el = add(left, right);
        const current = el.magnitude();
        if (maxMag == undefined || current > maxMag) {
            maxMag = current;
            maxEl = [left, right];
        }
    }
}

console.log(maxEl![0].toString());
console.log(maxEl![1].toString());
console.log(maxMag);

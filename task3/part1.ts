import {readTextBuffer, splitLines} from "../common/util.ts";

const data = readTextBuffer(import.meta.url);
const rows = splitLines(data);

const bitCounter: number[] = [];

rows.forEach(row => {
    for (let i = 0; i < row.length; i++) {
        if (row[i] == "1") {
            const current = bitCounter[i];
            bitCounter[i] = current == undefined ? 1 : current + 1;
        }
    }
});

const gammaString = bitCounter.reduce((prev, el) => {
    const bits = el ?? 0;
    const bitsMoreHalf = bits > (rows.length / 2);
    return prev + (bitsMoreHalf ? "1" : "0");
}, "");

function revertBits(text: string) {
    return Array.from(text).map(el => el == "1" ? "0" : "1").join("");
}

const epsilonString = revertBits(gammaString);

const gammaNumber = parseInt(gammaString, 2);
const epsilonNumber = parseInt(epsilonString, 2);

console.log(gammaNumber * epsilonNumber);
Deno.exit();

import {readTextBuffer} from "../common/util.ts";

const data = readTextBuffer(import.meta.url);
const numbers = data.split(",").map(Number);

const maxNumber = Math.max(...numbers);

function collectDiffs(numbers: number[], toCheck: number): number {
    return numbers.reduce(
        (previousValue, currentValue) => {
            const len = Math.abs(toCheck - currentValue);
            return previousValue + (len * (len + 1)) / 2;
        }, 0);
}

let minDiffs = Number.MAX_VALUE;

for (let i = 0; i < maxNumber; i++) {
    const candidate = collectDiffs(numbers, i);
    if (minDiffs > candidate) minDiffs = candidate;
}

console.log(minDiffs);
Deno.exit();

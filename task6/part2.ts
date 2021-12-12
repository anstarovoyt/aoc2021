import {readTextBuffer} from "../common/util.ts";

const data = readTextBuffer(import.meta.url);
const numbers = data.split(",").map(Number);
const days = 256;

function createArray(): number[] {
    return Array(9).fill(0);
}

const counters: number[] = createArray();

for (const el of numbers) {
    counters[el] = counters[el] + 1;
}

function tick(currentCounter: number[]) {
    const newCounter = createArray();
    for (let i = 0; i <= 8; i++) {
        const currentNumber = currentCounter[i];
        if (i == 0) {
            newCounter[8] += currentNumber;
            newCounter[6] += currentNumber;
        } else {
            newCounter[i - 1] += currentNumber;
        }
    }

    return newCounter;
}

let currentCounter = counters;
for (let _i = 0; _i < days; _i++) {
    currentCounter = tick(currentCounter);
}

console.log(currentCounter.reduce((prev, el) => prev + el));
Deno.exit();



import {readTextBuffer} from "../util.ts";

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

let currentCounter = counters;
for (let _i = 0; _i < days; _i++) {
    const newCounter: number[] = createArray();

    let restartedElements = 0;
    for (let i = 0; i <= 8; i++) {
        const currentNumber = currentCounter[i];
        if (i == 0) {
            newCounter[8] = currentNumber;
            restartedElements = restartedElements + currentNumber;
        } else {
            newCounter[i - 1] = currentNumber;
        }
    }

    newCounter[6] += restartedElements;
    currentCounter = newCounter;
}

console.log(currentCounter.reduce((prev, el) => prev + el));
Deno.exit();



import {readNumbers, readTextBuffer} from "../util.ts";

const numbers = readNumbers(readTextBuffer(import.meta.url));

let result = 0;
let prev = undefined;
for (let i = 0; i < numbers.length - 2; i++) {
    const current = numbers[i] + numbers[i + 1] + numbers[i + 2];
    if (prev && current > prev) ++result;
    prev = current;
}

console.log(result);
Deno.exit();
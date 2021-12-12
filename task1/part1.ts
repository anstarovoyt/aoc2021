import {readNumbers, readTextBuffer} from "../common/util.ts";

const numbers = readNumbers(readTextBuffer(import.meta.url));

let result = 0;
for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i + 1] > numbers[i]) result++;
}
console.log(result);
Deno.exit();







import {parseNumberArea} from "../util.ts";
import {tick} from "./task11-common.ts";

const numbers = parseNumberArea(import.meta.url);

let value = 0;
while (true) {
    value++;
    const tickValue = tick(numbers);
    if (tickValue == numbers.length * numbers[0].length) {
        console.log(value);
        break;
    }
}

Deno.exit();
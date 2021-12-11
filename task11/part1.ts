import {parseNumberArea} from "../util.ts";
import {tick} from "./task11-common.ts";

const numbers = parseNumberArea(import.meta.url);


let total = 0;
for (let i = 0; i < 100; i++) {
    total += tick(numbers);
}

console.log(total);

Deno.exit();
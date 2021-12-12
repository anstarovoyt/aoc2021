import {braces} from "./braces.ts";
import {error, readTextBuffer, splitLines} from "../common/util.ts";

const lines = splitLines(readTextBuffer(import.meta.url));

function cost(symbol: string) {
    switch (symbol) {
        case ")":
            return 3;
        case "]":
            return 57;
        case "}":
            return 1197;
        case ">":
            return 25137;
    }
    error("Incorrect state");
}


const incorrect: string[] = [];

for (const line of lines) {
    const expected: string[] = [];
    for (const lineElement of line) {
        const close = braces[lineElement];
        if (close == null) {
            if (expected.pop() != lineElement) {
                incorrect.push(lineElement);
                break;
            }
        } else {
            expected.push(close);
        }
    }
}

console.log(incorrect.reduce((previousValue, currentValue) => previousValue + cost(currentValue), 0));
Deno.exit();

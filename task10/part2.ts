import {error, readTextBuffer, split} from "../common/util.ts";
import {braces} from "./braces.ts";

const lines = split(readTextBuffer(import.meta.url));

function cost(symbol: string) {
    switch (symbol) {
        case ")":
            return 1;
        case "]":
            return 2;
        case "}":
            return 3;
        case ">":
            return 4;
    }
    error("Incorrect state");
}

const toCorrect: string[][] = [];

outer: for (const line of lines) {
    const expected: string[] = [];
    for (const lineElement of line) {
        const expectedClose = braces[lineElement];
        if (expectedClose == null) {
            //close
            if (expected.pop() != lineElement) {
                continue outer;
            }
        } else {
            expected.push(expectedClose);
        }
    }
    toCorrect.push(expected);
}


const result = toCorrect
    .map(el => el.reduceRight((sub, brace) => 5 * sub + cost(brace), 0))
    .sort((a, b) => a - b);

console.log(result[(result.length - 1) / 2]);
Deno.exit();

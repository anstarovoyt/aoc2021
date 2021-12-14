import {readTextBuffer} from "../common/util.ts";
import {maxMinDiff, parseInput} from "./task14-common.ts";

const buffer = readTextBuffer(import.meta.url);

const inputs = buffer.split("\n\n");

const startLine = inputs[0];
const mapping = parseInput(inputs[1]);

let currentLine = startLine;
for (let i = 0; i < 10; i++) {
    let newLine = "";
    for (let j = 0; j < currentLine.length; j++) {
        const first = currentLine[j];
        const second = currentLine[j + 1];
        newLine += first;
        if (second) {
            const mapped = mapping.get(first + second);
            if (mapped) {
                newLine += mapped;
            }
        }
    }

    currentLine = newLine;
}

console.log(maxMinDiff(currentLine));

Deno.exit();


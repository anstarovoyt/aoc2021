import {readTextBuffer, split} from "../util.ts";

const buffer = readTextBuffer(import.meta.url);
const lines = split(buffer);

const numbers = lines.map(line => line.split("").map(Number));

function isLocalMin(p1: number, p2: number) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;
            const offset1 = p1 + i;
            const offset2 = p2 + j;
            if (!(offset1 == p1 || offset2 == p2)) continue;
            const valueAt = numbers[offset1]?.[offset2];
            if (valueAt != undefined && numbers[p1][p2] >= valueAt) return false;
        }
    }
    return true;
}

const localMinimum = [];
for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers[i].length; j++) {
        if (isLocalMin(i, j)) {
            localMinimum.push(numbers[i][j]);
        }
    }
}

console.log(localMinimum.reduce((previousValue, currentValue) => previousValue + currentValue + 1, 0));
Deno.exit()

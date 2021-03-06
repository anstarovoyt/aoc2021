import {readTextBuffer, splitLines} from "../common/util.ts";

const data = readTextBuffer(import.meta.url);
const rowRows = splitLines(data);

function filterOut(rows: string[], bit: number, most: boolean) {
    const bitCounter = rows.reduce((prev, el) => el[bit] == "1" ? prev + 1 : prev, 0);
    const directBit = most ? "1" : "0";
    const inverseBit = most ? "0" : "1";

    switch (Math.sign(bitCounter - rows.length / 2)) {
        case 0:
        case 1:
            return rows.filter(el => el[bit] == directBit);
        case -1:
            return rows.filter(el => el[bit] == inverseBit);
    }
    return [];
}

function filterOutAll(most: boolean) {
    let rows = rowRows;
    let index = 0;
    while (rows.length > 1) {
        rows = filterOut(rows, index++, most);
    }
    return rows[0];
}

const mostString = filterOutAll(true);
const leastString = filterOutAll(false);

console.log(parseInt(mostString, 2) * parseInt(leastString, 2));
Deno.exit();

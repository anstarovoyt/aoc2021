import {readTextBuffer, split} from "../util.ts";

const data = readTextBuffer(import.meta.url);
const rowRows = split(data);

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

const most = filterOutAll(true);
const least = filterOutAll(false);

console.log(parseInt(most, 2) * parseInt(least, 2));
Deno.exit();
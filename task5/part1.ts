import {readTextBuffer, split} from "../common/util.ts";
import {Line} from "./line.ts";

const data = readTextBuffer(import.meta.url);
const rows = split(data);
const lines: Line[] = rows.map(el => new Line(el));

const table: number[][] = [];
for (const line of lines) {
    if (line.x1 == line.x2) {
        line.fillHorizontal(table);
    } else if (line.y1 == line.y2) {
        line.fillVertical(table);
    }
}

let result = 0;
for (const row of table) {
    if (!row) continue;
    for (const el of row) {
        if (el && el > 1) {
            ++result;
        }
    }
}

console.log(result);
Deno.exit();

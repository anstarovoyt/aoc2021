import {readTextBuffer, splitLines} from "../common/util.ts";
import {applyMask, createOriginalTable} from "./task20-common.ts";

const text = readTextBuffer(import.meta.url);
const parts = text.split("\n\n");
const [mask, mapLines] = parts;
if (mask.length != 512) throw new Error();
const originalTable = createOriginalTable(splitLines(mapLines));

let table = originalTable;
for (let i = 0; i < 50; i++) {
    table = applyMask(table, mask);
}

console.log(table.count());
Deno.exit();

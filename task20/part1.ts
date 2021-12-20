import {readTextBuffer, splitLines} from "../common/util.ts";
import {applyMask, createOriginalTable} from "./task20-common.ts";

const text = readTextBuffer(import.meta.url);
const parts = text.split("\n\n");
const [mask, mapLines] = parts;
if (mask.length != 512) throw new Error();
const originalTable = createOriginalTable(splitLines(mapLines));

const firstTry = applyMask(originalTable, mask);
console.log(applyMask(firstTry, mask).count());
Deno.exit();

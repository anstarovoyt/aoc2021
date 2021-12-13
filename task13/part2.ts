import {readTextBuffer, splitLines} from "../common/util.ts";
import {applyFolds, parseGrid, countElements} from "./task13-common.ts";

const buffer = readTextBuffer(import.meta.url);

const parts = buffer.split("\n\n");

const lines = splitLines(parts[0].trim());
const folds = splitLines(parts[1].trim());

const grid = parseGrid(lines);
const currentGrid = applyFolds(grid, folds);

//BLHFJPJF
console.log(countElements(currentGrid, true));

Deno.exit();



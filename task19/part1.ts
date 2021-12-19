import {readTextBuffer, splitLines} from "../common/util.ts";
import {calcRemapping, getIntersection, readScanners, ScannerData} from "./task19-common.ts";

const lines = splitLines(readTextBuffer(import.meta.url));

const scanners = readScanners(lines);

let entryScanner = scanners.shift()!;

let nextScanners = scanners;

while (nextScanners.length > 0) {
    const unused: ScannerData[] = [];
    for (let i = 0; i < nextScanners.length; i++) {
        const scanner = nextScanners[i];
        const intersection = getIntersection(entryScanner, scanner);
        if (intersection != undefined) {
            [entryScanner,] = calcRemapping(entryScanner, scanner, intersection[0], intersection[1]);
        } else {
            unused.push(scanner);
        }
    }
    nextScanners = unused;
}

console.log(entryScanner.points.length);

Deno.exit();

import {readTextBuffer, splitLines} from "../common/util.ts";
import {calcRemapping, getIntersection, Point, readScanners, ScannerData} from "./task19-common.ts";

const lines = splitLines(readTextBuffer(import.meta.url));

const scanners = readScanners(lines);

let entryScanner = scanners.shift()!;

let nextScanners = scanners;

const scannerCords = [new Point(0, 0, 0)];

while (nextScanners.length > 0) {
    const unused: ScannerData[] = [];
    for (let i = 0; i < nextScanners.length; i++) {
        const scanner = nextScanners[i];
        const intersection = getIntersection(entryScanner, scanner);
        if (intersection != undefined) {
            const result = calcRemapping(entryScanner, scanner, intersection[0], intersection[1]);
            entryScanner = result[0];
            scannerCords.push(result[1])
        } else {
            unused.push(scanner);
        }
    }
    nextScanners = unused;
}

scannerCords.forEach(el => console.log(el));

function distanceAbs(point1: Point, point2: Point) {
    return Math.abs(point1.x - point2.x) +
        Math.abs(point1.y - point2.y) +
        Math.abs(point1.z - point2.z);
}

let dist = 0;

for (const scannerCord1 of scannerCords) {
    for (const scannerCord2 of scannerCords) {
        const curr = distanceAbs(scannerCord1, scannerCord2);
        if (curr > dist) {
            dist = curr;
        }
    }
}

console.log(dist);

Deno.exit();

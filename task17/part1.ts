import {getProbeMaxY, parseInitialData} from "./task17-common.ts";
import {readTextBuffer} from "../common/util.ts";

const range = parseInitialData(readTextBuffer(import.meta.url));

const maxY = Math.max(Math.abs(range.y2), Math.abs(range.y1));
const maxX = Math.max(Math.abs(range.x2), Math.abs(range.x1));

let resultY: number = Number.MIN_VALUE;
for (let i = 0; i < maxY; i++) {
    for (let j = 0; j < maxX; j++) {
        const yCandidate = getProbeMaxY(j, i, range);
        if (yCandidate != undefined) {
            resultY = Math.max(maxY, yCandidate);
        }
    }
}
console.log(resultY);


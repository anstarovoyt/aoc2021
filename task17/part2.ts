import {getProbeMaxY, parseInitialData} from "./task17-common.ts";
import {readTextBuffer} from "../common/util.ts";

const range = parseInitialData(readTextBuffer(import.meta.url));

const maxY = Math.max(Math.abs(range.y2), Math.abs(range.y1));
const maxX = Math.max(Math.abs(range.x2), Math.abs(range.x1));

let counter = 0;
for (let i = -maxY * 10; i < maxY * 10; i++) {
    for (let j = -maxX * 10; j < maxX * 10; j++) {
        const yCandidate = getProbeMaxY(j, i, range);
        if (yCandidate != undefined) {
            counter++;
        }
    }
}

console.log(counter);


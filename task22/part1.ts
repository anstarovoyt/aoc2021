import {readTextBuffer, splitLines} from "../common/util.ts";
import {Instruction, limit, parseInstructions} from "./tas22-common.ts";

const data = readTextBuffer(import.meta.url);
const lines = splitLines(data);

export class PlainCubesArea {
    private cords: {
        [x: number]: { [y: number]: { [z: number]: boolean } | undefined } | undefined;
    } = {};

    count() {
        let counter = 0;
        for (const x of PlainCubesArea.cordElements(this.cords)) {
            const xLine = this.cords[x];
            if (xLine == undefined) continue;
            for (const y of PlainCubesArea.cordElements(xLine)) {
                const yLine = xLine[y];
                if (yLine == undefined) continue;
                counter += PlainCubesArea.cordElements(yLine).length;
            }
        }
        return counter;
    }

    apply(instruction: Instruction) {
        const state = instruction.state;
        for (let x = instruction.xRange[0]; x <= instruction.xRange[1]; x++) {
            let xLine = this.cords[x];
            if (xLine == undefined) {
                if (state == "off") continue;
                xLine = {};
                this.cords[x] = xLine;
            }
            for (let y = instruction.yRange[0]; y <= instruction.yRange[1]; y++) {
                let yLine = xLine[y];
                if (yLine == undefined) {
                    if (state == "off") continue;
                    yLine = {};
                    xLine[y] = yLine;
                }
                for (let z = instruction.zRange[0]; z <= instruction.zRange[1]; z++) {
                    if (state == "off") {
                        delete yLine[z];
                    } else {
                        yLine[z] = true;
                    }
                }
            }
        }
    }

    private static cordElements(obj: unknown) {
        return Object.getOwnPropertyNames(obj).map(Number);
    }
}
const instructions = parseInstructions(lines);

const actualInstructions = limit(instructions);

const area = new PlainCubesArea();
for (const actualInstruction of actualInstructions) {
    area.apply(actualInstruction);
}

console.log(area.count());
Deno.exit();

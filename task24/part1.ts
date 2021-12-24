import {readTextBuffer, splitLines} from "../common/util.ts";
import {ALUState, parseOps, runALU} from "./task24-common.ts";

const lines = splitLines(readTextBuffer(import.meta.url));
const ops = parseOps(lines);

for (let i = 13579246899999; i < 100000000000000; i++) {
    console.log(i);
    const input = i.toString().padStart(14, "0");
    if (input.includes("0")) continue;

    const state = new ALUState(input);

    const result = runALU(state, ops);
    if (result.z == 0) {
        console.log("Stop:" + i);
        break;
    }
}

Deno.exit();

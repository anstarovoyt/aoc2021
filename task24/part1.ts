import {readTextBuffer, splitLines} from "../common/util.ts";
import {ALUState, InpOp, Op, parseOps, runALU} from "./task24-common.ts";

const lines = splitLines(readTextBuffer(import.meta.url));
const ops: Op[] = parseOps(lines);

const inputPositions = [];

for (let i = 0; i < ops.length; i++) {
    if (ops[i] instanceof InpOp) inputPositions.push(i);
}



const firstOps = ops.slice(0, inputPositions[1]);

const statesAfterFirst: ALUState[] = [];

for (let i = 1; i <= 9; i++) {
    const state = new ALUState(i.toString());
    statesAfterFirst.push(runALU(state, firstOps));
}

const statesAfterSecond = [];

const secondOps = ops.slice(inputPositions[1], inputPositions[2]);

for (let i = 0; i <= 9; i++) {
    for (const prevState of statesAfterFirst) {
        const state = new ALUState(i.toString(), prevState);
        const result = runALU(state, secondOps);
        console.log(result);
        statesAfterSecond.push(result);
    }
}

Deno.exit();

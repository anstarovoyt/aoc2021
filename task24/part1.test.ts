import {assertEquals} from "https://deno.land/std@0.111.0/testing/asserts.ts";
import {ALUState, parseOps, runALU} from "./task24-common.ts";

function parseAndRun(state: ALUState, value: string, lines: string[]) {
    const ops = parseOps(lines);
    let counter = 0;
    return runALU(state, ops, () => {
        return Number(value[counter++]);
    });
}

Deno.test("Simple eq", () => {
    const result = parseAndRun(new ALUState(), "13", ["inp z", "inp x", "mul z 3", "eql z x"]);
    assertEquals(result.z, 1);
});

Deno.test("Simple not eq", () => {
    const result = parseAndRun(new ALUState(), "12", ["inp z", "inp x", "mul z 3", "eql z x"]);
    assertEquals(result.z, 0);
});

Deno.test("Mod op", () => {
    const result = parseAndRun(new ALUState(), "9", ["inp z", "mod z 10"]);
    assertEquals(result.z, 9);
});

Deno.test("Div op", () => {
    const result = parseAndRun(new ALUState(), "5", ["inp z", "div z 2"]);
    assertEquals(result.z, 2);
});

Deno.test("Add op", () => {
    const result = parseAndRun(new ALUState(), "5", ["inp x", "add x 2"]);
    assertEquals(result.x, 7);
});

Deno.test("Add negative op", () => {
    const result = parseAndRun(new ALUState(), "5", ["inp x", "add x -20"]);
    assertEquals(result.x, -15);
});

import {readTextBuffer} from "../common/util.ts";
import {Characters, process, splitText} from "./task25-common.ts";
import {assertEquals} from "https://deno.land/std@0.111.0/testing/asserts.ts";

const initialState = splitText(readTextBuffer(import.meta.url));

function checkResult(expectedText: string, arr: Characters) {
    const expected = splitText(expectedText);
    for (let i = 0; i < arr.length; i++) {
        const line = arr[i] ?? [];
        const expectedLine = expected[i] ?? [];
        for (let j = 0; j < line.length; j++) {
            assertEquals(line[j], expectedLine[j], `i: ${i}, j: ${j}`);
        }
    }
}

Deno.test("Step_1", () => {
    const after = process(initialState, 1)[1];
    checkResult(`
....>.>v.>
v.v>.>v.v.
>v>>..>v..
>>v>v>.>.v
.>v.v...v.
v>>.>vvv..
..v...>>..
vv...>>vv.
>.v.v..v.v`, after);
})

Deno.test("Step_2", () => {
    const after = process(initialState, 2)[1];
    checkResult(`
>.v.v>>..v
v.v.>>vv..
>v>.>.>.v.
>>v>v.>v>.
.>..v....v
.>v>>.v.v.
v....v>v>.
.vv..>>v..
v>.....vv.`, after);
})

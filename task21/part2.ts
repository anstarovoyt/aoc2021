import {readTextBuffer} from "../common/util.ts";

const buffer = readTextBuffer(import.meta.url);
const startPositions = buffer.split("\n").map(el => el.split(": ")[1]).map(Number);

const divider = 10;

type PositionToSums = [number, number][][];
const startState1: PositionToSums = [];
startState1[startPositions[0] - 1] = [[0, 1]];

const startState2: PositionToSums = [];
startState2[startPositions[1] - 1] = [[0, 1]];

function step(arr: PositionToSums): [PositionToSums, number] {
    const result: PositionToSums = [];
    let win = 0;
    for (let i = 0; i < 10; i++) {
        const currentData = arr[i];
        if (currentData == undefined) continue;
        for (let x1 = 1; x1 <= 3; x1++) {
            for (let x2 = 1; x2 <= 3; x2++) {
                for (let x3 = 1; x3 <= 3; x3++) {
                    const value = x1 + x2 + x3;
                    const newOffset = (i + value) % divider;
                    const toAdd = newOffset + 1;
                    let newSums = result[newOffset];
                    if (newSums == undefined) {
                        newSums = [];
                        result[newOffset] = newSums;
                    }

                    for (const [oldSum, oldCounter] of currentData) {
                        const newSum = oldSum + toAdd;
                        if (newSum >= 21) {
                            win += oldCounter;
                            continue;
                        }

                        let hasSum = false;
                        for (let j = 0; j < newSums.length; j++) {
                            const candidate = newSums[j];
                            const [sumCandidate, counter] = candidate;

                            if (sumCandidate == newSum) {
                                hasSum = true;
                                candidate[1] = counter + oldCounter;
                                break;
                            }
                        }
                        if (!hasSum) newSums.push([newSum, oldCounter]);
                    }
                }
            }
        }
    }

    return [result, win];
}

function total(arr: PositionToSums) {
    let result = 0;
    for (const data of arr) {
        if (data == undefined) continue;
        for (const candidate of data) {
            result += candidate[1];
        }
    }
    return result;
}

let result1 = 0;
let result2 = 0;
let state1: PositionToSums = startState1;
let state2: PositionToSums = startState2;

for (let i = 0; i < 21; i++) {
    const [newState1, win1] = step(state1);
    if (win1 > 0) {
        result1 += win1 * total(state2);
    }
    state1 = newState1;

    const [newState2, win2] = step(state2);
    if (win2 > 0) {
        result2 += win2 * total(state1);
    }
    state2 = newState2;
}

console.log(result1);
console.log(result2);

Deno.exit();

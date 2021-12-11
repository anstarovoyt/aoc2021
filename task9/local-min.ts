import {NumberGrid, surrounded} from "../util.ts";

export function isLocalMin(numbers: NumberGrid, p1: number, p2: number) {
    for (const [offset1, offset2] of surrounded(numbers, p1, p2)) {
        const valueAt = numbers[offset1][offset2];
        const el = numbers[p1][p2];
        if (el != undefined && valueAt != undefined && el >= valueAt) return false;
    }
    return true;
}

export function getLocalMins(numbers: NumberGrid): [number, number][] {
    const localMinimum: [number, number][] = [];
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers[i].length; j++) {
            if (isLocalMin(numbers, i, j)) {
                localMinimum.push([i, j]);
            }
        }
    }
    return localMinimum;
}


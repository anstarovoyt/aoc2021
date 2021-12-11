import {Area} from "../util.ts";

export function isLocalMin(numbers: Area, p1: number, p2: number) {
    for (const [offset1, offset2] of surrounded(numbers, p1, p2)) {
        const valueAt = numbers[offset1][offset2];
        const el = numbers[p1][p2];
        if (el != undefined && valueAt != undefined && el >= valueAt) return false;
    }
    return true;
}

export function getLocalMins(numbers: Area): [number, number][] {
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

export function surrounded(numbers: Area, p1: number, p2: number): [number, number][] {
    const result: [number, number][] = [];

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;
            const offset1 = p1 + i;
            const offset2 = p2 + j;
            if (!(offset1 == p1 || offset2 == p2)) continue;
            const valueAt = numbers[offset1]?.[offset2];
            if (valueAt != undefined) {
                result.push([offset1, offset2])
            }
        }
    }

    return result;
}


import {error, splitLines} from "../common/util.ts";

export type Characters = (undefined | string)[][];

function moveRight(arr: Characters, i: number, j: number): [number, number] {
    const line = arr[i];
    const position = j == line.length - 1 ? 0 : j + 1;
    return line[position] == undefined ? [i, position] : [i, j];
}

function moveDown(arr: Characters, i: number, j: number): [number, number] {
    const newLinePosition = i == arr.length - 1 ? 0 : i + 1;
    const line = arr[newLinePosition];
    if (line == undefined) return [i, j];
    return line[j] == undefined ? [newLinePosition, j] : [i, j];
}

function moveFor(state: Characters,
                 newState: Characters,
                 char: string,
                 points: [number, number][],
                 move: (arr: Characters, i: number, j: number) => [number, number]): boolean {
    const rightLength = gridRightLength(state);

    let result = false;
    for (const [i, j] of points) {
        const [i1, j1] = move(state, i, j);
        let line = newState[i1];
        if (line == null) {
            line = new Array(rightLength);
            newState[i1] = line;
        }
        line[j1] = char;
        if (i != i1 || j != j1) {
            result = true;
        }
    }

    for (let i = 0; i < state.length; i++) {
        const line = state[i];
        if (line == undefined) continue;
        let newLine = newState[i];
        if (newLine == undefined) {
            newLine = new Array(rightLength);
            newState[i] = newLine;
        }
        for (let j = 0; j < line.length; j++) {
            const el = line[j];
            if (el != undefined && el != char) {
                newLine[j] = el;
            }
        }
    }

    return result;
}

function gridRightLength(arr: (string | undefined)[][]) {
    return arr.reduce((previousValue, currentValue) => Math.max(previousValue, currentValue.length), 0);
}

function checkInvariants(arr: Characters, newState: Characters) {
    for (let i = 0; i < arr.length; i++) {
        let left = 0;
        let newLeft = 0;
        const line = arr[i] ?? [];
        const newLine = newState[i] ?? [];
        for (let j = 0; j < line.length; j++) {
            if (line[j] == ">") ++left;
            if (newLine[j] == ">") ++newLeft;
        }

        if (left != newLeft) error("Something wrong with lefts");
    }

    const rightLength = gridRightLength(arr);

    for (let j = 0; j < rightLength; j++) {
        let down = 0;
        let newDown = 0;
        for (let i = 0; i < arr.length; i++) {
            const line = arr[i] ?? [];
            const newLine = newState[i] ?? [];
            if (line[j] == "v") ++down;
            if (newLine[j] == "v") ++newDown;
        }

        if (down != newDown) error("Something wrong with downs");
    }
}

export function process(initialState: Characters, inter: number): [number, Characters] {
    let state = initialState;
    let steps = 0;
    for (let i = 0; i < inter; i++) {
        const right: [number, number][] = [];
        const down: [number, number][] = [];
        for (let i = 0; i < state.length; i++) {
            const line = state[i];
            if (line == undefined) continue;
            for (let j = 0; j < line.length; j++) {
                if (line[j] == ">") right.push([i, j]);
                if (line[j] == "v") down.push([i, j]);
            }
        }

        const afterRight: Characters = [];
        const changedRight = moveFor(state, afterRight, ">", right, moveRight);
        checkInvariants(state, afterRight);

        const result: Characters = [];
        const changedDown = moveFor(afterRight, result, "v", down, moveDown);
        checkInvariants(state, result);

        const changed = changedDown || changedRight;
        state = result;
        steps++;
        if (!changed) {
            console.log("Success");
            break;
        }
    }

    return [steps, state];
}

export function splitText(text: string) {
    return splitLines(text)
        .map(el =>
            el.split("")
                .map(el => el == "." ? undefined : el)
        );
}

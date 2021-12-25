export function readTextBuffer(importInfo: string, replacement: [string, string] = [".ts", ".txt"]): string {
    const pathName = new URL(importInfo).pathname;
    const newPath = pathName.replace(replacement[0], replacement[1]);
    try {
        Deno.statSync(newPath)
    } catch (e) {
        error("File doesn't exist", e);
    }
    return Deno.readTextFileSync(newPath).trim();
}

export function splitLines(buffer: string): string[] {
    return buffer.trim().split("\n");
}

export function readNumbers(buffer: string): number[] {
    return splitLines(buffer).map(Number);
}

export function error(text: string, e?: unknown): never {
    console.log(text);
    throw e ?? new Error(text);
}

export function parseDataAsGrid(buffer: string) {
    const lines = splitLines(buffer);

    return lines.map(line => line.trim().split("").map(Number));
}

export function parseNumberGrid(importInfo: string): NumberGrid {
    return parseDataAsGrid(readTextBuffer(importInfo));
}

export function printGrid(grid: unknown[][]) {
    const elements = grid.reduce((previousValue, currentValue) => Math.max(previousValue, currentValue.length),0);

    console.log("#".repeat(elements));
    for (let i = 0; i < grid.length; i++) {
        let row = "";
        const line = grid[i];
        for (let j = 0; j < elements; j++) {
            const el = line == undefined ? undefined : line[j];
            row += (el == undefined) ? "." : el;
        }
        console.log(row);
    }
    console.log("#".repeat(elements));
    console.log();
}

export type NumberGrid = (number | undefined)[][];

export function surrounded(numbers: NumberGrid, p1: number, p2: number, includeDiagonal: boolean = false): [number, number][] {
    const result: [number, number][] = [];

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;
            const offset1 = p1 + i;
            const offset2 = p2 + j;
            if (!includeDiagonal && (!(offset1 == p1 || offset2 == p2))) continue;
            const valueAt = numbers[offset1]?.[offset2];
            if (valueAt != undefined) {
                result.push([offset1, offset2])
            }
        }
    }

    return result;
}

export function variants(inputArr: string[]): string[][] {
    const result: string[][] = [];

    const permute = (toAppend: string[], leftPart: string[] = []) => {
        if (toAppend.length === 0) {
            result.push(leftPart)
        } else {
            for (let i = 0; i < toAppend.length; i++) {
                const curr = toAppend.slice();
                const next = curr.splice(i, 1);
                permute(curr.slice(), leftPart.concat(next))
            }
        }
    }

    permute(inputArr)

    return result;
}

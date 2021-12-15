export function readTextBuffer(importInfo: string): string {
    const pathName = new URL(importInfo).pathname;
    const newPath = pathName.replace(".ts", ".txt");
    try {
        Deno.statSync(newPath)
    } catch (e) {
        error("File doesn't exist", e);
    }
    return Deno.readTextFileSync(newPath).trim();
}

export function splitLines(buffer: string): string[] {
    return buffer.split("\n");
}

export function readNumbers(buffer: string): number[] {
    return splitLines(buffer).map(Number);
}

export function error(text: string, e?: unknown): never {
    console.log(text);
    throw e ?? new Error(text);
}

export function parseNumberGrid(importInfo: string): NumberGrid {
    const buffer = readTextBuffer(importInfo);
    const lines = splitLines(buffer);

    return lines.map(line => line.trim().split("").map(Number));
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

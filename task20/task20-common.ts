export class CompactTable {
    private table: {
        [p: number]: {
            [p: number]: boolean
        } | undefined
    } = {};

    public readonly inverse: string;

    constructor(public around: string) {
        this.inverse = around == "#" ? "." : "#";
    }

    at(i: number, j: number) {
        const line = this.table[i];
        if (line == undefined) return this.around;
        const el = line[j];
        return el != undefined ? this.inverse : this.around;
    }

    set(i: number, j: number, el: string) {
        if (el == this.around) return;
        let line = this.table[i];
        if (line == undefined) {
            line = {};
            this.table[i] = line;
        }
        line[j] = true;
    }

    count() {
        const lines = Object.getOwnPropertyNames(this.table).map(Number);
        let result = 0;
        for (const i of lines) {
            result += Object.getOwnPropertyNames(this.table[i]).length;
        }
        return result;
    }

    /**
     * List of affected points with possible duplications.
     * Could be optimized even more (by removing the duplicates), but it isn't required for the task
     */
    affectedPoints() {
        const lines = Object.getOwnPropertyNames(this.table).map(Number);
        const pointsToCheck: [number, number][] = [];

        for (const i of lines) {
            const lineContent = this.table[i];
            const lineIndexes = Object.getOwnPropertyNames(lineContent).map(Number);
            for (const j of lineIndexes) {
                const points = surrounded(i, j);
                pointsToCheck.push(...points);
            }
        }
        return pointsToCheck;
    }
}

export function surrounded(p1: number, p2: number): [number, number][] {
    const result: [number, number][] = [];

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const offset1 = p1 + i;
            const offset2 = p2 + j;
            result.push([offset1, offset2])
        }
    }

    return result;
}

export function createOriginalTable(mapLines: string[]) {
    const map: CompactTable = new CompactTable(".");
    for (let i = 0; i < mapLines.length; i++) {
        const line = mapLines[i];
        for (let j = 0; j < line.length; j++) {
            map.set(i, j, line[j]);
        }
    }
    return map;
}

export function applyMask(table: CompactTable, mask: string): CompactTable {
    const pointsToCheck = table.affectedPoints();

    const defaultAround = mask.charAt(0) == "#" ? table.inverse : table.around;

    const result: CompactTable = new CompactTable(defaultAround);
    for (const [i, j] of pointsToCheck) {
        const maskIndex = getAreaValue(table, i, j);
        result.set(i, j, mask.charAt(maskIndex));
    }

    return result;
}

function getFromTable(table: CompactTable, i: number, j: number) {
    return table.at(i, j) == "#" ? "1" : "0";
}

function getAreaValue(table: CompactTable, i: number, j: number): number {
    const points = surrounded(i, j);
    let result = "";
    for (const [i1, j1] of points) {
        result += getFromTable(table, i1, j1);
    }
    return Number.parseInt(result, 2);
}

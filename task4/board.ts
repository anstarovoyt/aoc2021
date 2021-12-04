import {error} from "../util.ts";

export class Board {
    constructor(private arr: number[][]) {
    }

    isCompleted(set: Set<number>) {
        for (let i = 0; i < 5; i++) {
            if (this.isCompletedLine(set, i)) return true;
        }
        for (let i = 0; i < 5; i++) {
            if (this.isCompletedColumn(set, i)) return true;
        }
        return false;
    }

    private isCompletedLine(set: Set<number>, line: number) {
        for (const el of this.arr[line]) {
            if (!set.has(el)) return false;
        }
        return true;
    }

    private isCompletedColumn(set: Set<number>, column: number) {
        for (let i = 0; i < this.arr.length; i++) {
            if (!set.has(this.arr[i][column])) return false;
        }

        return true;
    }

    score(set: Set<number>) {
        let result = 0;
        for (let i = 0; i < this.arr.length; i++) {
            for (let j = 0; j < this.arr[i].length; j++) {
                const el = this.arr[i][j];
                if (!set.has(el)) result += el;
            }
        }
        return result;
    }

}

export function parseInput(line: string) {
    return line.split(",").map(Number);
}

function parseLine(line: string) {
    return line.split(" ").map(el => el.trim()).filter(el => el.length > 0).map(Number);
}

function parseBoard(rows: string[], start: number) {
    const arr: number[][] = [];
    for (let i = start; i <= start + 4; i++) {
        const line = parseLine(rows[i]);
        if (line.length != 5) {
            error(`Wrong length: ${line.length}`);
        }
        arr.push(line);
    }

    if (arr.length != 5) throw error(`Incorrect board ${start}`);

    return new Board(arr);
}

export function parseBoards(rows: string[]) {
    const result: Board[] = [];
    for (let i = 2; i < rows.length; i += 6) {
        result.push(parseBoard(rows, i));
    }
    return result;
}
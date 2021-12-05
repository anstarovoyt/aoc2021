import {error} from "../util.ts";

export class Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    constructor(lineText: string) {
        const parts = lineText.split(" -> ");
        const [x1, y1] = parts[0].split(",").map(Number);
        this.x1 = x1;
        this.y1 = y1;

        const [x2, y2] = parts[1].split(",").map(Number);
        this.x2 = x2;
        this.y2 = y2;
    }

    fillHorizontal(table: number[][]) {
        const startRange = Math.min(this.y1, this.y2);
        const endRange = Math.max(this.y1, this.y2);
        for (let i = startRange; i <= endRange; i++) {
            let row = table[this.x1];
            if (row == null) {
                row = table[this.x1] = [];
            }
            const value = row[i];
            row[i] = value ? value + 1 : 1;
        }
    }

    fillVertical(table: number[][]) {
        const startRange = Math.min(this.x1, this.x2);
        const endRange = Math.max(this.x1, this.x2);
        for (let i = startRange; i <= endRange; i++) {
            let row = table[i];
            if (row == undefined) {
                row = table[i] = [];
            }
            const value = row[this.y1];
            row[this.y1] = value ? value + 1 : 1;
        }
    }

    fillDiagonal(table: number[][]) {
        const startRangeX = Math.min(this.x1, this.x2);
        const endRangeX = Math.max(this.x1, this.x2);

        const startRangeY = this.x1 == startRangeX ? this.y1 : this.y2;
        const endRangeY = this.x1 == startRangeX ? this.y2 : this.y1;

        const deltaX = endRangeX - startRangeX;
        const sign = endRangeY - startRangeY >= 0 ? 1 : -1;
        if (startRangeY + sign * deltaX != endRangeY) throw error("Wrong")

        for (let i = 0; i <= deltaX; i++) {
            let row = table[startRangeX + i];
            if (row == undefined) {
                row = table[startRangeX + i] = [];
            }
            const value = row[startRangeY + sign * i];
            row[startRangeY + sign * i] = value ? value + 1 : 1;
        }
    }
}
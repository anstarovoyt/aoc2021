import {error} from "../common/util.ts";

export class Range {
    constructor(public x1: number,
                public x2: number,
                public y1: number,
                public y2: number) {
        if (x2 < x1) error("Something wrong");
        if (y2 < y1) error("Something wrong");
    }

    isOutOfScope(x: number, y: number) {
        return x > this.x2 || y < this.y1;
    }

    inScope(x: number, y: number) {
        return x >= this.x1 && x <= this.x2 &&
            y >= this.y1 && y <= this.y2
    }
}

export function parseInitialData(data: string) {
    const cords = data.split(": ")[1];
    const split = cords.split(", ");
    const xs = split[0].trim().substr(2).split("..").map(Number);
    const ys = split[1].trim().substr(2).split("..").map(Number);

    return new Range(xs[0], xs[1], ys[0], ys[1]);
}

export function getProbeMaxY(x: number, y: number, range: Range) {
    let currentX = 0;
    let currentY = 0;
    let velocityX = x;
    let velocityY = y;
    let maxY = 0;

    while (true) {
        currentX += velocityX;
        currentY += velocityY;
        maxY = Math.max(maxY, currentY);
        if (range.isOutOfScope(currentX, currentY)) {
            return undefined;
        }
        if (range.inScope(currentX, currentY)) {
            return maxY;
        }

        velocityY -= 1;
        if (velocityX > 0) {
            velocityX -= 1;
        } else if (velocityX < 0) {
            velocityX += 1;
        }
    }
}

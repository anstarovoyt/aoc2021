export class Range {
    constructor(public x1: number,
                public x2: number,
                public y1: number,
                public y2: number) {
    }


}

export function parseInitialData(data: string) {
    const cords = data.split(": ")[1];
    const splitted = cords.split(", ");
    const xs = splitted[0].substr(0, 2).split("..").map(Number);
    const ys = splitted[1].substr(0, 2).split("..").map(Number);

    return new Range(xs[0], xs[1], ys[0], ys[1]);
}

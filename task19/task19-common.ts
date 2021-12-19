import {error, variants} from "../common/util.ts";

function distanceSq(point1: Point, point2: Point) {
    return Math.pow(point1.x - point2.x, 2) +
        Math.pow(point1.y - point2.y, 2) +
        Math.pow(point1.z - point2.z, 2);
}

export class ScannerData {
    #diffs: Map<number, Point>[] = [];

    constructor(public points: Point[]) {
    }

    toString() {
        return this.points.map(el => el.toString()).join("\n");
    }

    diffs(): Set<number>[] {
        return this.mappedDiffs().map(el => new Set(el.keys()));
    }

    mappedDiffs() {
        if (this.#diffs.length == 0) {
            for (const point1 of this.points) {
                const nextSet = new Map<number, Point>();
                for (const point2 of this.points) {
                    if (point1 === point2) continue;
                    const value = distanceSq(point1, point2);
                    nextSet.set(value, point2);
                }
                this.#diffs.push(nextSet);
            }
        }
        return this.#diffs;
    }

}

function intersectSets(a: Set<number>, b: Set<number>): Set<number> {
    return new Set([...a].filter(i => b.has(i)));
}

export function calcRemapping(scanner1: ScannerData, scanner2: ScannerData, index1: number, index2: number): [ScannerData, Point] {
    const originalStartPoint: Point = scanner1.points[index1];
    const mappedStartPoint = scanner2.points[index2];

    const diffs: Set<number> = intersectSets(scanner1.diffs()[index1], scanner2.diffs()[index2]);
    const [anyDiff] = diffs;
    const originalSecondPoint = scanner1.mappedDiffs()[index1].get(anyDiff)!;
    const mappedSecondPoint = scanner2.mappedDiffs()[index2].get(anyDiff)!;

    if (distanceSq(originalStartPoint, originalSecondPoint) !=
        distanceSq(mappedStartPoint, mappedSecondPoint)) {
        error("Something wrong with points");
    }

    const mappings = findCordMapping(
        originalStartPoint,
        originalSecondPoint,
        mappedStartPoint,
        mappedSecondPoint);

    const directionX = originalStartPoint.x - originalSecondPoint.x ==
        mappedStartPoint.getCord(mappings[0]) - mappedSecondPoint.getCord(mappings[0]);
    const directionY = originalStartPoint.y - originalSecondPoint.y ==
        mappedStartPoint.getCord(mappings[1]) - mappedSecondPoint.getCord(mappings[1]);
    const directionZ = originalStartPoint.z - originalSecondPoint.z ==
        mappedStartPoint.getCord(mappings[2]) - mappedSecondPoint.getCord(mappings[2]);

    const newPoints = scanner2.points.map(el =>
        transformPoint(el,
            mappings,
            originalStartPoint,
            mappedStartPoint,
            directionX,
            directionY,
            directionZ));

    const result: Point[] = [];
    const checked: Set<string> = new Set<string>();
    for (const point of scanner1.points) {
        result.push(point);
        checked.add(point.toString());
    }

    let duplicates = 0;
    for (const point of newPoints) {
        const pointText = point.toString();
        if (checked.has(pointText)) {
            duplicates++;
        } else {
            result.push(point);
            checked.add(pointText);
        }
    }
    if (duplicates < 12) error(`Something wrong with re-mapping ${duplicates}`);

    const scannerPoint = transformPoint(new Point(0, 0, 0), mappings, originalStartPoint,
        mappedStartPoint, directionX, directionY, directionZ);

    return [new ScannerData(result), scannerPoint];
}

function transformPoint(point: Point,
                        mappings: string[],
                        originalStartPoint: Point,
                        mappedStartPoint: Point,
                        directionX: boolean,
                        directionY: boolean,
                        directionZ: boolean
) {
    const newX = originalStartPoint.x - (directionX ? 1 : -1) * (mappedStartPoint.getCord(mappings[0]) - point.getCord(mappings[0]));
    const newY = originalStartPoint.y - (directionY ? 1 : -1) * (mappedStartPoint.getCord(mappings[1]) - point.getCord(mappings[1]));
    const newZ = originalStartPoint.z - (directionZ ? 1 : -1) * (mappedStartPoint.getCord(mappings[2]) - point.getCord(mappings[2]));

    return new Point(newX, newY, newZ);
}

function findCordMapping(point1: Point, point2: Point, mapped1: Point, mapped2: Point): string[] {
    const allVariants = variants(["x", "y", "z"]);
    for (const variant of allVariants) {
        if (Math.pow(point1.x - point2.x, 2) ==
            Math.pow(mapped1.getCord(variant[0]) - mapped2.getCord(variant[0]), 2) &&
            Math.pow(point1.y - point2.y, 2) ==
            Math.pow(mapped1.getCord(variant[1]) - mapped2.getCord(variant[1]), 2) &&
            Math.pow(point1.z - point2.z, 2) ==
            Math.pow(mapped1.getCord(variant[2]) - mapped2.getCord(variant[2]), 2)) {
            return variant;
        }
    }
    error("Something wrong");
}

export function getIntersection(scanner1: ScannerData, scanner2: ScannerData): [number, number] | undefined {
    for (let i = 0; i < scanner1.diffs().length; i++) {
        const diff1 = scanner1.diffs()[i];
        for (let j = 0; j < scanner2.diffs().length; j++) {
            const diff2 = scanner2.diffs()[j];
            const intersection = intersectSets(diff1, diff2);
            if (intersection.size >= 11) {
                return [i, j];
            }
        }
    }
    return undefined;
}

export class Point {

    constructor(public x: number, public y: number, public z: number) {
    }

    getCord(name: string): number {
        return (this as unknown as { [cord: string]: number })[name];
    }

    toString() {
        return `${this.x},${this.y},${this.z}`;
    }
}

export function readScanners(lines: string[]) {
    const scanners: ScannerData[] = [];
    let currentScanner: Point[] = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.length == 0) continue;

        const scannerInfoLine = line.startsWith("---");
        if (!scannerInfoLine) {
            const cords = line.split(",").map(Number);
            currentScanner.push(new Point(cords[0], cords[1], cords[2]));
        }

        if (scannerInfoLine || i == lines.length - 1) {
            if (currentScanner.length != 0) {
                scanners.push(new ScannerData(currentScanner));
                currentScanner = [];
            }
        }
    }
    return scanners;
}

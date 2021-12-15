import {NumberGrid, parseNumberGrid, surrounded} from "../common/util.ts";
import {calcSimplePath, isLastCord} from "./extendGrid.ts";

const grid: NumberGrid = parseNumberGrid(import.meta.url);

const simplePath = calcSimplePath(grid);
let minPath = simplePath;

const minCostMap: NumberGrid = [];

function calcPath(grid: NumberGrid, cords: [number, number], currentRisk: number,
                  paths: Set<string> = new Set<string>([[0, 0].toString()])) {
    if (isLastCord(grid, cords[0], cords[1])) {
        return currentRisk;
    }

    const points = surrounded(grid, cords[0], cords[1]);

    const toProcess = [];

    for (const point of points) {
        const pointString = point.toString();
        if (paths.has(pointString)) {
            continue;
        }

        const riskWithNext = currentRisk + grid[point[0]][point[1]]!;

        if (riskWithNext >= minPath) continue;

        let line = minCostMap[point[0]];
        if (line == undefined) {
            line = [];
            minCostMap[point[0]] = line;
        }

        const value = line[point[1]];
        if (value != undefined && riskWithNext > value) {
            continue;
        }

        line[point[1]] = riskWithNext;
        toProcess.push(point);
    }

    for (const point of toProcess) {
        const riskWithNext = currentRisk + grid[point[0]][point[1]]!;
        const pointString = point.toString();
        paths.add(pointString);
        const afterCalc = calcPath(grid, point, riskWithNext, paths);
        paths.delete(pointString);

        if (afterCalc < minPath) {
            minPath = afterCalc;
        }
    }

    return minPath;
}

console.log(calcPath(grid, [0, 0], 0));
Deno.exit();

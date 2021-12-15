import {NumberGrid, parseNumberGrid, surrounded} from "../common/util.ts";

const grid: NumberGrid = parseNumberGrid(import.meta.url);

function calcSimplePath(grid: NumberGrid): number {
    let result = 0;
    for (let i = 1; i < grid.length; i++) {
        result += grid[i][0]!;
    }

    for (let i = 0; i < grid[0].length; i++) {
        result += grid[grid.length - 1][i]!;
    }

    return result;
}

const simplePath = calcSimplePath(grid);

function calcPath(grid: NumberGrid, cords: [number, number], paths: Set<string>, risk: number) {
    if (cords[0] == grid.length - 1 && cords[1] == grid[0].length - 1) {
        //stop
        return risk;
    }

    const points = surrounded(grid, cords[0], cords[1]);
    let min = simplePath;
    for (const point of points) {

        let result = risk;
        if (paths.has(point.toString())) {
            continue;
        }

        result += grid[point[0]][point[1]]!;
        if (result > simplePath) continue;

        const set = new Set(paths);
        set.add(point.toString());

        const afterCalc = calcPath(grid, point, set, result);
        if (afterCalc < min) {
            min = afterCalc;
        }
    }

    return min;
}

console.log(calcPath(grid, [0, 0], new Set<string>([[0, 0].toString()]), 0));
Deno.exit();

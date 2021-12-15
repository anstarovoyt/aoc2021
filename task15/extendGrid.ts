import {NumberGrid} from "../common/util.ts";
import {initOrGetLine} from "../common/graphs.ts";

export function extendGrid(grid: NumberGrid): NumberGrid {
    const result: NumberGrid = [];
    for (let i = 0; i < grid.length * 5; i++) {
        for (let j = 0; j < grid[0].length * 5; j++) {
            if (i < grid.length && j < grid.length) {
                const resultLine = initOrGetLine(result, i);
                resultLine[j] = grid[i][j];
                continue;
            }

            let valueWithOffset: number | undefined;
            if (j < grid[0].length) {
                valueWithOffset = result[i < grid.length ? 0 : i - grid.length][j]! + 1;
            } else {
                valueWithOffset = result[i][j - grid[0].length]! + 1
            }

            if (valueWithOffset >= 10) valueWithOffset = 1;
            const resultLine = initOrGetLine(result, i);
            resultLine[j] = valueWithOffset;
        }
    }

    return result;
}

export function calcSimplePath(grid: NumberGrid): number {
    let result = 0;
    for (let i = 1; i < grid.length; i++) {
        result += grid[i][0]!;
    }

    for (let i = 0; i < grid[0].length; i++) {
        result += grid[grid.length - 1][i]!;
    }

    return result;
}

export function isLastCord(grid: NumberGrid, p1: number, p2: number) {
    return p1 == grid.length - 1 && p2 == grid[0].length - 1;
}

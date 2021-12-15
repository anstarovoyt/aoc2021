import {NumberGrid, parseNumberGrid} from "../common/util.ts";
import {extendGrid, isLastCord} from "./extendGrid.ts";
import {initOrGetLine} from "../common/graphs.ts";


const grid: NumberGrid = parseNumberGrid(import.meta.url);

function mark(grid: NumberGrid) {
    const stack: [[number, number, number]] = [[0, 0, 0]];
    const weights: NumberGrid = [];
    initOrGetLine(weights, 0)[0] = 0;

    // const simplePath = calcSimplePath(grid);

    while (stack.length > 0) {
        const [i, j, risk] = stack.shift()!;
        const weightLineOriginal = weights[i];
        if (risk > weightLineOriginal[j]!) continue;

        for (let subI = -1; subI <= 1; subI++) {
            for (let subJ = -1; subJ <= 1; subJ++) {
                if (subI == 0 && subJ == 0) continue;
                const p1 = i + subI;
                const p2 = j + subJ;
                if ((!(p1 == i || p2 == j))) continue;
                const valueAt = grid[p1]?.[p2];
                if (valueAt == undefined) continue;
                const newWeight = grid[p1][p2]! + risk;
                const weightLine = initOrGetLine(weights, p1);
                const storedWeight = weightLine[p2];
                if (storedWeight != undefined && storedWeight <= newWeight) {
                    continue;
                }
                weightLine[p2] = newWeight;
                if (isLastCord(grid, p1, p2)) {
                    continue;
                }
                stack.push([p1, p2, newWeight]);
            }
        }
    }

    return weights[weights.length - 1][weights[0].length - 1];
}

console.log(mark(extendGrid(grid)));

Deno.exit();

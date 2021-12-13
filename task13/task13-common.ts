function foldUp(grid: boolean[][], y: number): boolean[][] {
    const result: boolean[][] = [];

    for (let i = 0; i < y; i++) {
        const line = grid[i];
        result[i] = line ? [...line] : [];
    }
    for (let i = y; i < grid.length; i++) {
        const line = grid[i];
        if (!line) continue;

        const realIndex = 2 * y - i;
        const resultLine = result[realIndex] ?? [];
        for (let j = 0; j < line.length; j++) {
            const currentValue = line[j];
            if (currentValue) {
                resultLine[j] = currentValue;
            }
        }
    }

    return result;
}

function foldLeft(grid: boolean[][], x: number) {
    const result: boolean[][] = [];

    const gridLineLength = getGridLineLength(grid);

    for (let i = 0; i < grid.length; i++) {
        result[i] = new Array(x);
        const gridLine = grid[i];
        for (let j = 0; j < x; j++) {
            result[i][j] = gridLine ? gridLine[j] : false;
        }

        if (!gridLine) continue;
        for (let j = x; j < gridLineLength; j++) {
            const value = gridLine[j];
            if (!value) continue;
            const realIndex = 2 * x - j;
            result[i][realIndex] = value;
        }
    }

    return result;
}

function getGridLineLength(grid: boolean[][]) {
    return grid.reduce((previousValue, currentValue) => Math.max(previousValue, currentValue.length), 0);
}

export function countElements(grid: boolean[][], print = false): number {
    let counter = 0;
    const maxLineLength = getGridLineLength(grid);
    for (let i = 0; i < grid.length; i++) {
        const line = grid[i];
        let result = "";
        for (let j = 0; j < maxLineLength; j++) {
            const value = line && line[j];
            result += value ? "#" : ".";
            if (value) ++counter;
        }

        if (print) console.log(result);
    }
    return counter;
}

export function applyFolds(grid: boolean[][], folds: string[]) {
    let currentGrid = grid;

    for (const fold of folds) {
        const parts = fold.split("=");
        switch (parts[0]) {
            case "fold along x" :
                currentGrid = foldLeft(currentGrid, Number(parts[1]));
                break;
            case "fold along y":
                currentGrid = foldUp(currentGrid, Number(parts[1]));
                break;
        }
    }
    return currentGrid;
}

export function parseGrid(lines: string[]) {
    const grid: boolean[][] = [];

    for (const line of lines) {
        const strings = line.split(",").map(Number);
        const x = strings[0];
        const y = strings[1];
        let row = grid[y];
        if (row == undefined) {
            row = [];
            grid[y] = row;
        }
        row[x] = true;
    }
    return grid;
}

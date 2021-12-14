export function parseInput(text: string): Map<string, string> {
    const result = new Map<string, string>();
    for (const line of text.split("\n")) {
        const parts = line.split(" -> ");
        result.set(parts[0], parts[1]);
    }
    return result;
}

export function findMinMax(map: Map<string, number>): [[string, number], [string, number]] {
    let max: undefined | [string, number] = undefined;
    let min: undefined | [string, number] = undefined;

    for (const entry of map.entries()) {
        const value = entry[1];
        if (!max || value > max[1]) {
            max = entry;
        }
        if (!min || value < min[1]) {
            min = entry;
        }
    }

    return [min!, max!];
}

export function maxMinDiff(line: string) {
    const map = new Map<string, number>();
    for (const el of line) {
        let counter = map.get(el) ?? 0;
        map.set(el, ++counter);
    }
    const minMax = findMinMax(map);
    return minMax[1][1] - minMax[0][1];
}

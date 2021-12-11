import {NumberGrid, surrounded} from "../util.ts";

export function tick(numbers: NumberGrid) {
    const flashes: [number, number][] = [];
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers[i].length; j++) {
            const current = numbers[i][j];
            if (current == 9) {
                flashes.push([i, j]);
                numbers[i][j] = 0;
            } else if (current != null) {
                numbers[i][j] = current + 1;
            }
        }
    }

    return increaseEnergy(numbers, flashes);
}

function increaseEnergy(numbers: NumberGrid, flashes: [number, number][]) {
    let counter = 0;
    while (flashes.length > 0) {
        const [p1, p2] = flashes.pop()!;
        counter++;
        const points = surrounded(numbers, p1, p2, true);

        for (const candidate of points) {
            const [c1, c2] = candidate;
            const value = numbers[c1][c2];
            if (!value) continue;
            if (value == 9) {
                flashes.push(candidate);
                numbers[c1][c2] = 0;
            } else {
                numbers[c1][c2] = value + 1;
            }
        }
    }

    return counter;
}

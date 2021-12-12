import {getLocalMins} from "./local-min.ts";
import {parseNumberArea, surrounded} from "../common/util.ts";


const numbers = parseNumberArea(import.meta.url);
const mins = getLocalMins(numbers);
const components: number[] = [];

function markComponent(min: [number, number]) {
    //already marked
    if (numbers[min[0]][min[1]] == undefined) return -1;

    const toProcess: [number, number][] = [min];
    let size = 0;
    while (toProcess.length > 0) {
        const [p1, p2] = toProcess.pop()!;
        numbers[p1][p2] = undefined;
        ++size;

        const elements = surrounded(numbers, p1, p2);
        for (const candidate of elements) {
            const [c1, c2] = candidate;
            const candidateValue = numbers[c1][c2];
            if (candidateValue == undefined || candidateValue == 9) continue;
            toProcess.push(candidate);
        }
    }
    return size;
}

for (const min of mins) {
    components.push(markComponent(min));
}

components.sort((a, b) => b - a);

console.log(components.slice(0, 3).reduce((previousValue, currentValue) => previousValue * currentValue, 1));
Deno.exit()

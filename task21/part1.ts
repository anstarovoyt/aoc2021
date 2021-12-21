import {readTextBuffer} from "../common/util.ts";

const buffer = readTextBuffer(import.meta.url);
const startPositions = buffer.split("\n").map(el => el.split(": ")[1]).map(Number);

const positions = startPositions.map(el => [el - 1, 0]);

let dice = 0;
let total = 0;

function nextStep() {
    total++;
    return dice == 100 ? dice = 1 : ++dice;
}


top: while (true) {
    for (let i = 0; i < positions.length; i++) {
        const [position, score] = positions[i];
        const addition = nextStep() + nextStep() + nextStep();
        const nextPosition = (position + addition) % 10;
        const nextScore = score + (nextPosition + 1);
        positions[i] = [nextPosition, nextScore];
        if (nextScore >= 1000) {
            break top;
        }
    }
}

const minValue = positions.reduce((prev, curr) => Math.min(prev, curr[1]), Number.MAX_VALUE);
console.log(minValue);
console.log(total);
console.log(minValue * total);
Deno.exit();

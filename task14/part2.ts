import {readTextBuffer} from "../common/util.ts";
import {findMinMax, parseInput} from "./task14-common.ts";

const buffer = readTextBuffer(import.meta.url);

const inputs = buffer.split("\n\n");

const startLine = inputs[0];
const mapping = parseInput(inputs[1]);


const startCounters: Map<string, number> = new Map();

for (let j = 0; j < startLine.length; j++) {
    const first = startLine[j];
    const second = startLine[j + 1];
    if (second) {
        const el = first + second;
        const count = startCounters.get(el) ?? 0;
        startCounters.set(el, count + 1);
    }
}


let currentCounters = startCounters;

for (let i = 0; i < 40; i++) {
    const newCounters: Map<string, number> = new Map();
    for (const entry of currentCounters.entries()) {
        const name = entry[0];
        const counter = entry[1];
        const symbol = mapping.get(name);
        const firstPart = name[0] + symbol;
        const firstPartValue = newCounters.get(firstPart) ?? 0;
        newCounters.set(firstPart, firstPartValue + counter);
        const secondPart = symbol + name[1];
        const secondPartValue = newCounters.get(secondPart) ?? 0;
        newCounters.set(secondPart, secondPartValue + counter);
    }
    currentCounters = newCounters;
}

function countCombinations(counters: Map<string, number>) {
    const symbols: Map<string, number> = new Map();

    for (const entry of counters) {
        const combination = entry[0];
        const counter = entry[1];
        symbols.set(combination[0], (symbols.get(combination[0]) ?? 0) + counter);
        symbols.set(combination[1], (symbols.get(combination[1]) ?? 0) + counter);
    }

    return symbols;
}

const afterCombination = countCombinations(currentCounters);
const minMax = findMinMax(afterCombination);

console.log(Math.floor(minMax[1][1] / 2) - Math.floor(minMax[0][1] / 2) + 1);

Deno.exit();

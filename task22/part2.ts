import {error, readTextBuffer, splitLines} from "../common/util.ts";
import {Instruction, parseInstructions} from "./tas22-common.ts";

const data = readTextBuffer(import.meta.url);
const lines = splitLines(data);
const instructions = parseInstructions(lines);

function getCommonRange(range1: [number, number], range2: [number, number]): [number, number] | undefined {
    const left = Math.max(range1[0], range2[0]);
    const right = Math.min(range1[1], range2[1]);
    return right >= left ? [left, right] : undefined;
}

function intersectAreas(instruction1: Instruction, instruction2: Instruction): Instruction | undefined {
    const xCommon = getCommonRange(instruction1.xRange, instruction2.xRange);
    if (xCommon == undefined) return undefined;
    const yCommon = getCommonRange(instruction1.yRange, instruction2.yRange);
    if (yCommon == undefined) return undefined;
    const zCommon = getCommonRange(instruction1.zRange, instruction2.zRange);
    if (zCommon == undefined) return undefined;

    return new Instruction(instruction2.state, xCommon, yCommon, zCommon);
}

let areas: Instruction[] = [];


main: for (const instruction of instructions) {
    if (instruction.state == "on") {
        const toRemoveAreas: Set<Instruction> = new Set();
        for (const area of areas) {
            if (area.contains(instruction)) continue main;
            if (instruction.contains(area)) {
                toRemoveAreas.add(area);
            }
        }

        const newAreas: Instruction[] = [];
        let currentInstructions: Instruction[] = [instruction];
        for (const area of areas) {
            if (toRemoveAreas.has(area)) continue;
            newAreas.push(area);
            const newCurrentInstructions: Instruction[] = [];

            for (const instr of currentInstructions) {
                const intersection = intersectAreas(area, instr);
                if (intersection == undefined) {
                    newCurrentInstructions.push(instr);
                } else {
                    const items = instr.removeArea(intersection);
                    newCurrentInstructions.push(...items);
                }
            }
            currentInstructions = newCurrentInstructions;
        }
        newAreas.push(...currentInstructions);
        areas = newAreas;
    } else if (instruction.state == "off") {
        const toRemoveAreas: Set<Instruction> = new Set();
        for (const area of areas) {
            if (instruction.contains(area)) {
                toRemoveAreas.add(area);
            }
        }

        const newAreas: Instruction[] = [];
        for (const area of areas) {
            if (toRemoveAreas.has(area)) continue;
            const intersection = intersectAreas(area, instruction);
            if (intersection == undefined) {
                newAreas.push(area);
                continue;
            }
            newAreas.push(...area.removeArea(intersection));
        }

        areas = newAreas;
    }
}

for (const area of areas) {
    for (const area1 of areas) {
        if (area1 == area) continue;
        if (intersectAreas(area, area1) != null) {
            error("Something wrong");
        }
    }
}

console.log(areas.reduce((previousValue, currentValue) => previousValue + currentValue.size(), 0));

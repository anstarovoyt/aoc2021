import {error, readTextBuffer} from "../common/util.ts";
import {forbiddenHallway, Letters, letters, parseInput} from "./task23-common.ts";

const text = readTextBuffer(import.meta.url);

function buildResultArray() {
    const result = new Array(11);
    result.push(...letters, ...letters);
    return result;
}


const startArray = parseInput(text);
if (startArray.length != 19) error("Incorrect input: " + startArray.length);

function getLetterOffset(letter: string) {
    switch (letter) {
        case "A":
            return 0;
        case "B":
            return 1;
        case "C":
            return 2;
        case "D":
            return 3;
        default:
            error("Something wrong");
    }
}


function getDestinations(letter: string) {
    const offset = getLetterOffset(letter);
    return [11 + offset, 15 + offset];
}

function getOutsideRoom(letter: string) {
    return 2 + getLetterOffset(letter) * 2;
}

function getRoomOwner(position: number) {
    for (const letter of letters) {
        const [top, bottom] = getDestinations(letter);
        if (top == position || bottom == position) return letter;
    }

    error("Incorrect root position");
}

function generatePositionStartFromRoom(arr: Letters, position: number, oldEnergy: number) {
    const el = arr[position]!;
    const [topPoint, bottomPoint] = getDestinations(el);
    //in a right place, cannot go
    if (position == bottomPoint ||
        position == topPoint && arr[bottomPoint] == el) return [];

    const topOrBottom = position < 15 ? 1 : 2;
    if (topOrBottom == 2) {
        const topPosition = position - 4;
        //cannot go
        if (arr[topPosition] != undefined) return [];
    }

    return [...generatePositionFromRoom(arr, position, topOrBottom, 1, oldEnergy),
        ...generatePositionFromRoom(arr, position, topOrBottom, -1, oldEnergy)];

}

function generatePositionFromRoom(arr: Letters,
                                  position: number,
                                  topOrBottom: number,
                                  inc: number,
                                  oldEnergy: number): [Letters, number][] {
    const el = arr[position]!;
    const hallwayToStart = getOutsideRoom(getRoomOwner(position));
    const hallwayForOwnRoom = getOutsideRoom(el);
    if (arr[hallwayToStart]) error("Rule (1) is violated");

    const result: [Letters, number][] = [];
    let move = hallwayToStart + inc;
    while (move >= 0 && move <= 10) {
        //cannot go further
        if (arr[move] != undefined) break;
        const multiply = Math.pow(10, getLetterOffset(el));
        const energy = oldEnergy + (topOrBottom + Math.abs(hallwayToStart - move)) * multiply;
        if (!forbiddenHallway.includes(move)) {
            const temp: Letters = [...arr];
            temp[position] = undefined;
            temp[move] = el;
            result.push([temp, energy]);
        } else if (hallwayForOwnRoom == move) {
            //try to go inside from the prev position
            const temp: Letters = [...arr];
            const tempPosition = move - inc;
            temp[position] = undefined;
            temp[tempPosition] = el;
            result.push(...generatePositionsFromHallway(temp, tempPosition, energy));
        }
        move += inc;
    }
    return result;
}

function generatePositionsFromHallway(arr: Letters, position: number, oldEnergy: number): [Letters, number][] {
    const el = arr[position]!;
    //hallway
    //can move to the rooms
    const [topPoint, bottomPoint] = getDestinations(el);
    const top = arr[topPoint];
    if (top != undefined) return [];
    const bottom = arr[bottomPoint];
    const hallwayToGo = getOutsideRoom(el);
    if (arr[hallwayToGo] != undefined) error("Rule (1) is violated");
    if (bottom == undefined || bottom == el) {
        const inc = position > hallwayToGo ? -1 : 1;
        let step = position;
        while (hallwayToGo != step) {
            step += inc;
            if (arr[step] != undefined) return [];
        }
        const result: Letters = [...arr];
        result[position] = undefined;
        result[bottom == undefined ? bottomPoint : topPoint] = el;
        const multiply = Math.pow(10, getLetterOffset(el));
        const energy = (Math.abs(position - hallwayToGo) + (bottom == undefined ? 2 : 1)) * multiply;
        return [[result, energy + oldEnergy]];
    }

    return [];
}

function generateNextPositions(arr: Letters, position: number, oldEnergy: number): [Letters, number][] {
    const el = arr[position]!;
    if (el == undefined) error("Incorrect position");
    if (position < 11) {
        return generatePositionsFromHallway(arr, position, oldEnergy);
    } else {
        return generatePositionStartFromRoom(arr, position, oldEnergy);
    }
}

function findMin(startArray: Letters) {
    const stack: [Letters, number][] = [[startArray, 0]];
    const min: Map<string, number> = new Map();
    const resultKey = buildResultArray().toString();
    while (stack.length > 0) {
        const [arr, energy] = stack.pop()!;
        const key = arr.toString();
        const value = min.get(key)!;
        if (value && energy >= value) continue;
        min.set(key, energy);

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == undefined) continue;

            for (const candidate of generateNextPositions(arr, i, energy)) {
                const candidateKey = candidate[0].toString();
                const minForCandidate = min.get(candidateKey);
                if (minForCandidate != undefined && candidate[1] >= minForCandidate) {
                    continue;
                }
                stack.push(candidate);
            }
        }
    }


    console.log(min.get(resultKey));
}

findMin(startArray);
Deno.exit();

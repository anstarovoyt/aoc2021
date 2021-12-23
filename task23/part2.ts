import {error, readTextBuffer} from "../common/util.ts";
import {forbiddenHallway, Letters, letters, parseInput} from "./task23-common.ts";

const text = readTextBuffer(import.meta.url);

function buildResultArray() {
    const result = new Array(11);
    result.push(...letters, ...letters, ...letters, ...letters);
    return result;
}

function validateArray(startArray: Letters) {
    if (startArray.length != 19 + 4 + 4) {
        error("Incorrect input: " + startArray.length);
    }
}

const startArray = parseInput(text);
const finalArray = buildResultArray();

validateArray(startArray);
validateArray(finalArray);

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
    return [11 + offset, 15 + offset, 19 + offset, 23 + offset];
}

function getOutsideRoom(letter: string) {
    return 2 + getLetterOffset(letter) * 2;
}

function getRoomOwner(position: number) {
    for (const letter of letters) {
        for (const destination of getDestinations(letter)) {
            if (destination == position) return letter;
        }
    }

    error("Incorrect root position");
}

function generatePositionStartFromRoom(arr: Letters, position: number, oldEnergy: number) {
    const el = arr[position]!;
    const destinations = getDestinations(el);
    let allInRightPlace = true;

    //check if we need to do something with it
    for (let i = destinations.length - 1; i >= 0; i--) {
        if (allInRightPlace && position == destinations[i]) {
            //right place
            return [];
        }
        if (arr[destinations[i]] != el) allInRightPlace = false;
    }

    const currentStack = getDestinations(getRoomOwner(position));

    const startToCheckStack = currentStack.indexOf(position);

    for (let i = startToCheckStack - 1; i >= 0; i--) {
        //there are some elements
        if (arr[currentStack[i]] != undefined) return [];
    }

    const moveOut = startToCheckStack + 1;

    return [...generatePositionFromRoom(arr, position, moveOut, 1, oldEnergy),
        ...generatePositionFromRoom(arr, position, moveOut, -1, oldEnergy)];

}

function generatePositionFromRoom(arr: Letters,
                                  position: number,
                                  moveOut: number,
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
        const energy = oldEnergy + (moveOut + Math.abs(hallwayToStart - move)) * multiply;
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
    const destinations = getDestinations(el);
    let targetDestinationIndex = -1;
    for (let i = destinations.length - 1; i >= 0; i--) {
        const next = arr[destinations[i]];
        if (next != undefined && next != el) return [];
        if (next == undefined && targetDestinationIndex == -1) {
            targetDestinationIndex = i;
        }
    }

    const hallwayToGo = getOutsideRoom(el);
    if (arr[hallwayToGo] != undefined) error("Rule (1) is violated");
    const inc = position > hallwayToGo ? -1 : 1;
    let step = position;
    while (hallwayToGo != step) {
        step += inc;
        if (arr[step] != undefined) return [];
    }
    const result: Letters = [...arr];
    result[position] = undefined;
    result[destinations[targetDestinationIndex]] = el;
    const multiply = Math.pow(10, getLetterOffset(el));
    const depth = targetDestinationIndex + 1;
    const energy = (Math.abs(position - hallwayToGo) + depth) * multiply;
    return [[result, energy + oldEnergy]];
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
    const resultKey = finalArray.toString();
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
                validateArray(candidate[0]);
                stack.push(candidate);
            }
        }
    }


    console.log(min.get(resultKey));
}

findMin(startArray);
Deno.exit();

import {readTextBuffer, split} from "../util.ts";
import {parseBoards, parseInput} from "./board.ts";

const data = readTextBuffer(import.meta.url);
const rows = split(data);

const inputNumbers = parseInput(rows[0]);
const boards = parseBoards(rows);

const set: Set<number> = new Set()
for (const inputNumber of inputNumbers) {
    set.add(inputNumber);
    for (const board of boards) {
        if (board.isCompleted(set)) {
            console.log(board.score(set) * inputNumber);
            Deno.exit();
        }
    }
}



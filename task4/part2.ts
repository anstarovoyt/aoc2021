import {readTextBuffer, split} from "../common/util.ts";
import {parseBoards, parseInput} from "./board.ts";

const data = readTextBuffer(import.meta.url);
const rows = split(data);

const inputNumbers = parseInput(rows[0]);
let boards = parseBoards(rows);

const set: Set<number> = new Set()
for (const inputNumber of inputNumbers) {
    set.add(inputNumber);
    const newBoards = [];
    for (const board of boards) {
        if (board.isCompleted(set)) {
            if (boards.length == 1) {
                console.log(board.score(set) * inputNumber);
                Deno.exit();
            }
        } else {
            newBoards.push(board);
        }
    }
    boards = newBoards;
}

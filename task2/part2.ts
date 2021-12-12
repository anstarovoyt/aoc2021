import {readTextBuffer, split} from "../common/util.ts";

const data = readTextBuffer(import.meta.url);
const rows = split(data);

const state = {
    horizontal: 0,
    depth: 0,
    aim: 0
}

rows.forEach(el => {
    const strings = el.split(" ");
    const offset = Number(strings[1]);
    switch (strings[0]) {
        case "forward":
            state.horizontal += offset;
            state.depth += state.aim * offset
            break;
        case "down":
            state.aim += offset;
            break;
        case "up":
            state.aim -= offset;
            break;
    }
})

console.log(state.horizontal * state.depth);
Deno.exit();

import {readTextBuffer, split} from "../util.ts";
import {NumberLine} from "./NumberLine.ts";

const data = split(readTextBuffer(import.meta.url)).map(el => new NumberLine(el));


console.log(data.reduce((previousValue, currentValue) => {
    const count = currentValue.right.filter(el =>
        el.length == 2 ||
        el.length == 4 ||
        el.length == 3 ||
        el.length == 7).length;
    return previousValue + count;
}, 0));
Deno.exit();

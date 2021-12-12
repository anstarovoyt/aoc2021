import {readTextBuffer, split} from "../common/util.ts";
import {NumberLine} from "./NumberLine.ts";

const data = split(readTextBuffer(import.meta.url)).map(el => new NumberLine(el));

console.log("total: " + data.map(el => el.decodeValue())
    .map(Number)
    .reduce((previousValue, currentValue) => previousValue + currentValue, 0));

Deno.exit();

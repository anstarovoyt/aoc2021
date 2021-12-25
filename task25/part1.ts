import {readTextBuffer} from "../common/util.ts";
import {Characters, process, splitText} from "./task25-common.ts";

const text = readTextBuffer(import.meta.url);

const initialArray: Characters = splitText(text);
const [counter, ] = process(initialArray, 100_000);
console.log(counter);

Deno.exit();

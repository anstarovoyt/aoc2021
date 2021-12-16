import {readTextBuffer} from "../common/util.ts";
import {parsePackages, toBinaryString} from "./task16-common.ts";

const buffer = readTextBuffer(import.meta.url);

const parsed = parsePackages(toBinaryString(buffer));

console.log(parsed.calcValue());

import {readTextBuffer, splitLines} from "../common/util.ts";
import {applyBySteps, parseOps} from "./task24-common.ts";

applyBySteps(parseOps(splitLines(readTextBuffer(import.meta.url))), true);
Deno.exit();

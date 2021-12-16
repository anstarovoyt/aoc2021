import {readTextBuffer} from "../common/util.ts";
import {OperatorPackage, Package, parsePackages, toBinaryString} from "./task16-common.ts";

const buffer = readTextBuffer(import.meta.url);

const parsed = parsePackages(toBinaryString(buffer));

const toCalc: Package[] = [parsed];
let result = 0;
while (toCalc.length > 0) {
    const el = toCalc.pop()!;
    if (el instanceof OperatorPackage) {
        toCalc.push(...el.packages)
    }
    result += el.version;
}

console.log(result);

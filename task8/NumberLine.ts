import {error} from "../util.ts";

const a = 0;
const b = 1;
const c = 2;
const d = 3;
const e = 4;
const f = 5;
const g = 6;

//constraints
const r0 = [a, b, c, e, f, g];
const r1 = [c, f];
const r2 = [a, c, d, e, g];
const r3 = [a, c, d, f, g];
const r4 = [b, c, d, f];
const r5 = [a, b, d, f, g];
const r6 = [a, b, d, e, f, g];
const r7 = [a, c, f];
const r8 = [a, b, c, d, e, f, g];
const r9 = [a, b, c, d, f, g];

const constraints: number[][] = [r0, r1, r2, r3, r4, r5, r6, r7, r8, r9];

function variants(inputArr: string[]) {
    const result: string[][] = [];

    const permute = (toAppend: string[], leftPart: string[] = []) => {
        if (toAppend.length === 0) {
            result.push(leftPart)
        } else {
            for (let i = 0; i < toAppend.length; i++) {
                const curr = toAppend.slice();
                const next = curr.splice(i, 1);
                permute(curr.slice(), leftPart.concat(next))
            }
        }
    }

    permute(inputArr)

    return result;
}

const allCombinations = new Set(variants(["a", "b", "c", "d", "e", "f", "g"]));

export class NumberLine {
    left: readonly string[];
    right: readonly string[];

    constructor(row: string) {
        const parts = row.split("|");
        this.left = parts[0].trim().split(" ").sort((a1, b1) => a1.length - b1.length);
        this.right = parts[1].trim().split(" ");
    }

    decodeValue() {
        const mapping = NumberLine.toMap(this.apply());
        let result = "";
        for (const word of this.right) {
            const wordArray = word.split("").map(el => mapping.get(el)).sort();
            for (let i = 0; i < constraints.length; i++) {
                const constraint = constraints[i];
                if (constraint.toString() == wordArray.toString()) {
                    result += i;
                }
            }
        }
        return result;
    }

    /**
     * Actually, we need to use here "Kuhn's Algorithm for Maximum Bipartite Matching",
     * but we have not so many combinations and the input is very predictable, so let's do it directly
     */
    private apply() {
        let candidates = allCombinations;
        for (const word of this.left) {
            candidates = this.filterCandidates(word, candidates);
            if (candidates.size == 1) break;
        }

        if (candidates.size != 1) {
            error("Something wrong: " + candidates.size);
        }

        const [first] = candidates;
        return first;
    }

    protected filterCandidates(word: string, candidates: Set<string[]>): Set<string[]> {
        const combinations = variants(word.split(""));
        const result: Set<string[]> = new Set();

        for (let i = 0; i < constraints.length; i++) {
            const constraint = constraints[i];
            if (constraint.length != word.length) continue;

            for (const combination of combinations) {
                for (const el of candidates) {
                    if (NumberLine.isAcceptable(constraint, el, combination)) {
                        result.add(el);
                    }
                }
            }
        }

        return new Set(result);
    }

    private static isAcceptable(constraint: number[], el: string[], combination: string[]) {
        return constraint.every((value, index) => el[value] == combination[index]);
    }
    private static toMap(mappings: string[]) {
        const result: Map<string, number> = new Map();
        for (let i = 0; i < mappings.length; i++) {
            const el = mappings[i];
            result.set(el, i);
        }
        return result;
    }
}

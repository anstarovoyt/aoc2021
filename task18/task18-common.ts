import {error} from "../common/util.ts";

export class Pair {
    parent: Pair | undefined;

    constructor(public left: Pair | number,
                public right: Pair | number) {
        if (left instanceof Pair) {
            left.parent = this;
        }
        if (right instanceof Pair) {
            right.parent = this;
        }
    }

    get depth(): number {
        let next = this.parent;
        let depth = 1;
        while (next != null) {
            depth++;
            next = next.parent;
        }
        return depth;
    }

    isSimple() {
        return typeof this.left == "number" && typeof this.right == "number";
    }

    toString(): string {
        return "[" + this.left.toString() + "," + this.right.toString() + "]";
    }

    magnitude(): number {
        const left: number = this.left instanceof Pair ? this.left.magnitude() : this.left;
        const right: number = this.right instanceof Pair ? this.right.magnitude() : this.right;

        return left * 3 + right * 2;
    }
}

export function parsePairs(data: string): Pair {
    const stack: (Pair | number)[] = [];
    for (const el of data) {
        if (el == "]") {
            const right = stack.pop()!;
            const left = stack.pop()!;
            stack.push(new Pair(left, right));
        } else if (el != "," && el != "[") {
            stack.push(Number(el));
        }
    }

    if (stack.length != 1) error("");

    return stack[0] as Pair;
}

export function add(left: Pair, right: Pair) {
    const pair = new Pair(left, right);

    while (true) {
        const exCandidate = findToExplode(pair);
        if (exCandidate != null) {
            explode(exCandidate);
            continue;
        }

        const splitCandidate = findToSplit(pair);
        if (splitCandidate != null) {
            split(splitCandidate);
            continue;
        }
        break;
    }

    return pair;
}

export function findToExplode(pair: Pair): Pair | undefined {
    const toCheck = [pair];

    while (toCheck.length > 0) {
        const curr = toCheck.pop()!;
        if (curr.right instanceof Pair) {
            toCheck.push(curr.right);
        }
        if (curr.left instanceof Pair) {
            toCheck.push(curr.left);
        }
        if (curr.isSimple() && curr.depth > 4) {
            return curr;
        }
    }

    return undefined;
}

export function split(pair: Pair): Pair | undefined {
    const left = pair.left;
    if (typeof left == "number" && left >= 10) {
        const toInsert = createPair(left);
        toInsert.parent = pair;
        pair.left = toInsert;
        return toInsert;
    } else {
        const right = pair.right;
        if (typeof right == "number" && right >= 10) {
            const toInsert = createPair(right);
            toInsert.parent = pair;
            pair.right = toInsert;
            return toInsert;
        }
    }
}

function createPair(el: number,) {
    return new Pair(Math.floor(el / 2), Math.ceil(el / 2))
}

export function findToSplit(pair: Pair): Pair | undefined {
    const toCheck: [Pair | number, Pair | undefined][] = [[pair, undefined]];

    while (toCheck.length > 0) {
        const [el, parent] = toCheck.pop()!;
        if (typeof el == "number" && el >= 10) return parent;
        if (el instanceof Pair) {
            toCheck.push([el.right, el]);
            toCheck.push([el.left, el]);
        }
    }

    return undefined;
}

export function findAndExplode(pair: Pair) {
    const toExplode = findToExplode(pair);
    explode(toExplode!);
    return pair;
}

export function findAndSplit(pair: Pair) {
    const toSplit = findToSplit(pair);
    if (toSplit != undefined) {
        split(toSplit);
    }
    return pair;
}

export function findChildWithNumberInPosition(pair: Pair, left: boolean) {
    let toCheck = pair;
    while (toCheck != undefined) {
        const child = left ? toCheck.left : toCheck.right;
        if (typeof child == "number") return toCheck;
        toCheck = child;
    }

    return undefined;
}

export function findFirstParentWhereInPosition(pair: Pair, left: boolean): Pair | undefined {
    let curr = pair;
    while (curr != null) {
        const parent = curr.parent;
        if (parent == undefined) return undefined;
        const child = left ? parent.left : parent.right;
        if (child == curr) return parent;
        curr = parent;
    }

    return undefined;
}

export function explode(pair: Pair) {
    if (!pair.isSimple()) error("Pair should be simple");

    const result: Pair[] = [];

    const whereRight = findFirstParentWhereInPosition(pair, false);
    if (whereRight != undefined) {
        const leftNumber = pair.left as number;
        const left = whereRight.left;
        if (left instanceof Pair) {
            const deepest = findChildWithNumberInPosition(left as Pair, false);
            if (deepest != undefined) {
                deepest.right = deepest.right as number + leftNumber;
                result.push(deepest);
            }
        } else {
            whereRight.left = whereRight.left as number + leftNumber;
            result.push(whereRight);
        }
    }

    const whereLeft = findFirstParentWhereInPosition(pair, true);
    if (whereLeft != undefined) {
        const rightNumber = pair.right as number;
        const right = whereLeft.right;
        if (right instanceof Pair) {
            const deepest = findChildWithNumberInPosition(right as Pair, true);
            if (deepest != undefined) {
                deepest.left = deepest.left as number + rightNumber;
                result.push(deepest);
            }
        } else {
            whereLeft.right = whereLeft.right as number + rightNumber;
            result.push(whereLeft);
        }
    }

    const parent = pair.parent!;
    if (parent.left == pair) parent.left = 0;
    if (parent.right == pair) parent.right = 0;

    return result;
}

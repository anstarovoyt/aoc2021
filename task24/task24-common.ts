import {error} from "../common/util.ts";

export class ALUState {
    w = 0;
    x = 0;
    y = 0;
    z = 0;

    constructor(prevState?: ALUState) {
        if (prevState != undefined) {
            this.w = prevState.w;
            this.x = prevState.x;
            this.y = prevState.y;
            this.z = prevState.z;
        }
    }

    toString() {
        return `w: ${this.w}, x: ${this.x}, y: ${this.y}, z: ${this.z}`
    }
}

export abstract class Op {
    abstract apply(state: ALUState, input: () => number): ALUState;
}

export class InpOp extends Op {
    to: Registers;

    constructor(to: string) {
        super();
        if (!isValidRegister(to)!) error("Incorrect input");
        this.to = to;
    }

    apply(state: ALUState, inputProducer: () => number): ALUState {
        state[this.to] = inputProducer();
        return state;
    }

}

function isValidRegister(arg: string): arg is Registers {
    return arg == "x" || arg == "y" || arg == "z" || arg == "w";
}

type Registers = "x" | "y" | "z" | "w";

abstract class BinOp extends Op {
    from: Registers;
    argPointer: Registers | undefined;
    arg: number | undefined;

    constructor(from: string, arg: string) {
        super();
        if (!isValidRegister(from)) error("Something wrong");
        this.from = from;
        this.argPointer = isValidRegister(arg) ? arg : undefined;
        this.arg = this.argPointer != undefined ? undefined : Number(arg);
    }

    argValue(state: ALUState): number {
        if (this.arg != undefined) return this.arg;
        if (this.argPointer == undefined) error("Arg or to must be not specified");

        const result = state[this.argPointer];
        if (result == undefined) error("Pointer value must be specified");

        return result;
    }

    apply(state: ALUState): ALUState {
        return this.applyForValue(state[this.from], this.argValue(state), state);
    }

    abstract applyForValue(left: number, right: number, state: ALUState): ALUState;
}

class MulOp extends BinOp {
    applyForValue(left: number, right: number, state: ALUState): ALUState {
        state[this.from] = left * right;
        return state;
    }
}

class AddOp extends BinOp {
    applyForValue(left: number, right: number, state: ALUState): ALUState {
        state[this.from] = left + right;
        return state;
    }
}

class DivOp extends BinOp {
    applyForValue(left: number, right: number, state: ALUState): ALUState {
        if (right == 0) error("Zero right argument")
        state[this.from] = Math.floor(left / right);
        return state;
    }
}

class ModOp extends BinOp {
    applyForValue(left: number, right: number, state: ALUState): ALUState {
        if (left < 0) error("Negative argument");
        if (right <= 0) error("Non-positive argument");

        state[this.from] = left % right;
        return state;
    }
}

class EqOp extends BinOp {
    applyForValue(left: number, right: number, state: ALUState): ALUState {
        state[this.from] = left == right ? 1 : 0;
        return state;
    }
}

export function parseOps(lines: string[]): Op[] {
    return lines.map(el => {
        const parts = el.split(" ");
        const to = parts[1];
        const arg = parts[2];
        switch (parts[0]) {
            case "inp":
                return new InpOp(to);
            case "mul":
                return new MulOp(to, arg);
            case "div":
                return new DivOp(to, arg);
            case "mod":
                return new ModOp(to, arg);
            case "eql":
                return new EqOp(to, arg);
            case "add":
                return new AddOp(to, arg);
            default:
                error("incorrect input");
        }
    })
}

export function runALU(state: ALUState, ops: Op[], inputProducer: () => number): ALUState {
    let curr = state;
    if (!(ops[0] instanceof InpOp)) error("Incorrect ops");
    for (const op of ops) {
        curr = op.apply(curr, inputProducer);
    }

    return curr;
}

export function applyBySteps(ops: Op[], min: boolean) {
    const inputPositions = [];

    for (let i = 0; i < ops.length; i++) {
        if (ops[i] instanceof InpOp) inputPositions.push(i);
    }


    let states: Map<number, number> = new Map();
    states.set(0, 0);
    for (let ip = 0; ip < inputPositions.length; ip++) {
        const subOps = ops.slice(inputPositions[ip], inputPositions[ip + 1]);
        const newStates: Map<number, number> = new Map();
        const isLast = ip == inputPositions.length - 1;
        for (const [prevState, prevNumber] of states) {
            for (let i = 1; i <= 9; i++) {
                const state = new ALUState();
                state.z = prevState;
                const newState = runALU(state, subOps, () => i);
                const key = newState.z;
                if (isLast) if (key != 0) continue;

                const value = newStates.get(key);
                const currValue = prevNumber * 10 + i;
                if (value == undefined || (min ? (currValue < value) : (currValue > value))) {
                    newStates.set(key, currValue);
                }
            }
        }
        console.log(`Input ${ip + 1}, state counter: ${newStates.size}`);
        states = newStates;
    }

    for (const [value, number] of states) {
        if (value == 0) console.log(number);
    }

    return;
}

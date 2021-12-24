import {error} from "../common/util.ts";

export class ALUState {
    w = 0;
    x = 0;
    y = 0;
    z = 0;
    input;
    inputIndex = 0;

    constructor(input?: string) {
        this.input = input == undefined ? "" : input;
    }

    readInput(): number {
        return Number(this.input[this.inputIndex++]);
    }
}

export abstract class Op {
    abstract apply(state: ALUState): ALUState;
}

class InpOp extends Op {
    to: Registers;

    constructor(to: string) {
        super();
        if (!isValidRegister(to)!) error("Incorrect input");
        this.to = to;
    }

    apply(state: ALUState): ALUState {
        state[this.to] = state.readInput();
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

export function runALU(state: ALUState, ops: Op[]): ALUState {
    let curr = state;
    for (const op of ops) {
        curr = op.apply(curr);
    }

    if (state.inputIndex != state.input.length) error("Incomplete input read");

    return curr;
}


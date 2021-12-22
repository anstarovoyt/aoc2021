export class Instruction {

    constructor(public state: "on" | "off",
                public xRange: [number, number],
                public yRange: [number, number],
                public zRange: [number, number]) {
    }

    size() {
        return (this.xRange[1] - this.xRange[0] + 1) *
            (this.yRange[1] - this.yRange[0] + 1) *
            (this.zRange[1] - this.zRange[0] + 1)
    }

    insideOf(range: [number, number], toCheck: [number, number]) {
        return range[0] <= toCheck[0] && range[1] >= toCheck[1];
    }

    contains(instruction: Instruction) {
        return this.insideOf(this.xRange, instruction.xRange) &&
            this.insideOf(this.yRange, instruction.yRange) &&
            this.insideOf(this.zRange, instruction.zRange);
    }

    removeArea(instruction: Instruction): Instruction[] {
        const result: Instruction[] = [];
        //validate input

        if (instruction.xRange[0] > this.xRange[0]) {
            const xKeep = [this.xRange[0], instruction.xRange[0] - 1] as [number, number];
            result.push(new Instruction("on", xKeep, this.yRange, this.zRange))
        }

        if (instruction.yRange[0] > this.yRange[0]) {
            const xKeep = instruction.xRange;
            const yKeep = [this.yRange[0], instruction.yRange[0] - 1] as [number, number];
            result.push(new Instruction("on", xKeep, yKeep, this.zRange))
        }

        if (instruction.zRange[0] > this.zRange[0]) {
            const xKeep = instruction.xRange;
            const yKeep = instruction.yRange;
            const zKeep = [this.zRange[0], instruction.zRange[0] - 1] as [number, number];
            result.push(new Instruction("on", xKeep, yKeep, zKeep))
        }

        if (this.zRange[1] > instruction.zRange[1]) {
            const xKeep = instruction.xRange;
            const yKeep = instruction.yRange;
            const zKeep = [instruction.zRange[1] + 1, this.zRange[1]] as [number, number];
            result.push(new Instruction("on", xKeep, yKeep, zKeep))
        }

        if (this.yRange[1] > instruction.yRange[1]) {
            const xKeep = instruction.xRange;
            const yKeep = [instruction.yRange[1] + 1, this.yRange[1]] as [number, number];
            result.push(new Instruction("on", xKeep, yKeep, this.zRange))
        }


        if (this.xRange[1] > instruction.xRange[1]) {
            const xKeep = [instruction.xRange[1] + 1, this.xRange[1]] as [number, number];
            result.push(new Instruction("on", xKeep, this.yRange, this.zRange))
        }

        return result;
    }
}

export function parseInstructions(lines: string[]) {
    return lines.map(line => {
        const parts = line.split(" ");
        const state = parts[0] as "on" | "off";
        const ranges = parts[1]
            .split(",")
            .map(el => el.substr(2))
            .map(el => el.split("..").map(Number) as [number, number]);

        return new Instruction(state, ranges[0], ranges[1], ranges[2]);
    })
}

function checkRange(range: [number, number]) {
    return range[0] >= -50 && range[1] <= 50;
}

export function limit(instructions: Instruction[]) {
    return instructions.filter(instr => {
        return checkRange(instr.xRange) && checkRange(instr.yRange) && checkRange(instr.zRange);
    });
}

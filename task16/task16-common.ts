import {error} from "../common/util.ts";

export abstract class Package {
    version: number;
    typeId: number;

    protected constructor(version: string, typeId: string, public totalLength: number) {
        this.version = parseBinary(version);
        this.typeId = parseBinary(typeId);
    }

    abstract calcValue(): number;
}

export class LiteralPackage extends Package {

    constructor(public value: number, version: string, typeId: string, totalLength: number) {
        super(version, typeId, totalLength);
    }

    calcValue(): number {
        return this.value;
    }
}

export class OperatorPackage extends Package {

    constructor(version: string, typeId: string, totalLength: number, public packages: Package[]) {
        super(version, typeId, totalLength);
    }

    calcValue(): number {
        switch (this.typeId) {
            case 0:
                return this.packages.reduce((previousValue, currentValue) =>
                    previousValue + currentValue.calcValue(), 0);
            case 1:
                return this.packages.reduce((previousValue, currentValue) =>
                    previousValue * currentValue.calcValue(), 1);
            case 2:
                return this.packages.reduce((previousValue, currentValue) =>
                    Math.min(previousValue, currentValue.calcValue()), Number.MAX_VALUE);
            case 3:
                return this.packages.reduce((previousValue, currentValue) =>
                    Math.max(previousValue, currentValue.calcValue()), Number.MIN_VALUE);
            case 5:
                return this.packages[0].calcValue() > this.packages[1].calcValue() ? 1 : 0;
            case 6:
                return this.packages[0].calcValue() < this.packages[1].calcValue() ? 1 : 0;
            case 7:
                return this.packages[0].calcValue() == this.packages[1].calcValue() ? 1 : 0;
        }

        error("Something wrong");
    }
}

export function toBinaryString(hex: string) {
    let result = ""
    for (const symbol of hex) {
        const binary = Number.parseInt(symbol, 16).toString(2);
        result += binary.padStart(4, "0");
    }

    return result;
}

export function splitHeader(bin: string) {
    const version = bin.substring(0, 3);
    const typeId = bin.substring(3, 6);
    const other = bin.substring(6);

    return [version, typeId, other];
}

export function parseBinary(binary: string) {
    return Number.parseInt(binary, 2);
}

export function parseLiteral(bin: string) {
    let indexer = 0;
    let binary = "";
    while (true) {
        const first = Number(bin.charAt(indexer));
        binary += bin.substr(indexer + 1, 4);
        if (first === 0) break;
        indexer += 5;
    }

    return [parseBinary(binary), indexer + 5];
}

const headerLength = 6;
const subPacketsLengthBits = 15;
const subPacketsCountBits = 11;

export function parsePackages(bin: string): Package {
    const [version, typeId, other] = splitHeader(bin);
    const typeIdNumber = parseBinary(typeId);
    if (typeIdNumber == 4) {
        const [literal, length] = parseLiteral(other);
        const totalPackageLength = length + headerLength;
        return new LiteralPackage(literal, version, typeId, totalPackageLength)
    } else {
        const lengthBit = other.charAt(0);
        if (lengthBit === "0") {
            const subPacketsLength = parseBinary(other.substr(1, subPacketsLengthBits));
            const subPackagesString = other.substr(subPacketsLengthBits + 1);
            let counter = 0;
            const packages: Package[] = [];
            while (counter < subPacketsLength) {
                const candidate = parsePackages(subPackagesString.substr(counter));
                counter += candidate.totalLength;
                packages.push(candidate);
            }

            const totalPackageLength = headerLength + subPacketsLengthBits + subPacketsLength + 1;
            return new OperatorPackage(version, typeId, totalPackageLength, packages);
        } else if (lengthBit === "1") {
            const subPacketsCount = parseBinary(other.substr(1, subPacketsCountBits));
            const subPackagesString = other.substr(subPacketsCountBits + 1);
            let counter = 0;
            const packages: Package[] = [];
            for (let i = 0; i < subPacketsCount; i++) {
                const candidate = parsePackages(subPackagesString.substr(counter));
                counter += candidate.totalLength;
                packages.push(candidate);
            }

            const totalPackageLength = headerLength + subPacketsCountBits + counter + 1;
            return new OperatorPackage(version, typeId, totalPackageLength, packages);
        } else error("Something wrong");
    }
}

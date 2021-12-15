import {NumberGrid} from "./util.ts";

export class GraphNode {
    nodes: GraphNode[] = [];

    constructor(public label: string) {
    }

    addNode(node: GraphNode) {
        this.nodes.push(node);
    }

    toString() {
        return this.label + ", nodes: " + this.nodes.map(el => el.label).join();
    }
}

export function initOrGetLine(result: NumberGrid, lineNumber: number): (number|undefined)[] {
    let resultLine = result[lineNumber];
    if (resultLine == undefined) {
        resultLine = [];
        result[lineNumber] = resultLine;
    }
    return resultLine;
}

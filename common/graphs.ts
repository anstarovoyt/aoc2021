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


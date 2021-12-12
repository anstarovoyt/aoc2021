import {GraphNode} from "../common/graphs.ts";

function createAndSet(nodes: Map<string, GraphNode>, label: string) {
    const node = new GraphNode(label);
    nodes.set(label, node);
    return node;
}

export function buildGraph(lines: string[], nodes: Map<string, GraphNode>) {
    for (const line of lines) {
        const parts = line.trim().split("-");
        const left = parts[0];
        const right = parts[1];
        const leftNode = nodes.get(left) ?? createAndSet(nodes, left);
        const rightNode = nodes.get(right) ?? createAndSet(nodes, right);
        leftNode.addNode(rightNode);
        rightNode.addNode(leftNode);
    }
}

export function countVisiting(node: GraphNode) {
    return node.label.toUpperCase() != node.label;
}

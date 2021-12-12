import {readTextBuffer, splitLines} from "../common/util.ts";
import {GraphNode} from "../common/graphs.ts";
import {buildGraph, countVisiting} from "./task12-common.ts";

const lines = splitLines(readTextBuffer(import.meta.url));
const nodes = new Map<string, GraphNode>();

buildGraph(lines, nodes);

function counts(startNode: GraphNode, endNode: GraphNode, visited: Set<string> = new Set(), hasTwiceVisited = false) {
    if (startNode == endNode) return 1;
    if (countVisiting(startNode)) {
        if (visited.has(startNode.label)) {
            if (hasTwiceVisited || startNode == nodes.get("start")) return 0;
            hasTwiceVisited = true;
        }
        visited.add(startNode.label);
    }

    let result = 0;

    for (const node of startNode.nodes) {
        const newVisited = new Set(visited);
        result += counts(node, endNode, newVisited, hasTwiceVisited);
    }

    return result;
}

console.log(counts(nodes.get("start")!, nodes.get("end")!));
Deno.exit();



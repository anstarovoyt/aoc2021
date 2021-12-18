import {add, findAndExplode, findAndSplit, findToExplode, findToSplit, Pair, parsePairs} from "./task18-common.ts";
import {assert, assertEquals} from "https://deno.land/std@0.111.0/testing/asserts.ts";

Deno.test("Simple parse", () => {
    const original = "[[1,2],[[3,4],5]]";
    const pair = parsePairs(original);

    assertEquals(pair.toString(), original);
    assert(pair instanceof Pair);
    assertEquals(pair.depth, 1);
    const firstRight = pair.right;
    assert(firstRight instanceof Pair);
    assertEquals(firstRight.depth, 2);
    const deepestLeft = firstRight.left;
    assert(deepestLeft instanceof Pair);
    assertEquals(deepestLeft.depth, 3);
});

Deno.test("Find to explode", () => {
    const pair = parsePairs("[[[[[9,8],1],2],3],4]");
    assert(pair instanceof Pair);
    const toExplode = findToExplode(pair)!;
    assertEquals(toExplode.toString(), "[9,8]");

    const noExplodePair = parsePairs("[[[[9,8],1],2],3]");
    assert(noExplodePair instanceof Pair);
    assert(findToExplode(noExplodePair) == undefined)
})

Deno.test("Explode", () => {
    assertEquals(findAndExplode(parsePairs("[[[[[9,8],1],2],3],4]")).toString(),
        "[[[[0,9],2],3],4]");
    assertEquals(findAndExplode(parsePairs("[7,[6,[5,[4,[3,2]]]]]")).toString(),
        "[7,[6,[5,[7,0]]]]");
    assertEquals(findAndExplode(parsePairs("[[6,[5,[4,[3,2]]]],1]")).toString(),
        "[[6,[5,[7,0]]],3]");
    assertEquals(findAndExplode(parsePairs("[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]")).toString(),
        "[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]");
    assertEquals(findAndExplode(parsePairs("[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]")).toString(),
        "[[3,[2,[8,0]]],[9,[5,[7,0]]]]");
})

Deno.test("Find to split", () => {
    const pair = parsePairs("[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]");
    findAndExplode(findAndExplode(pair));
    assertEquals(pair.toString(), "[[[[0,7],4],[15,[0,13]]],[1,1]]")
    const toSplit = findToSplit(pair);
    assert(toSplit instanceof Pair);
    assertEquals(toSplit.left, 15);
    assertEquals(findAndSplit(pair).toString(), "[[[[0,7],4],[[7,8],[0,13]]],[1,1]]");
})

Deno.test("Magnitude", () => {
    const pair = parsePairs("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]");

    assertEquals(pair.magnitude(), 1384);
})

Deno.test("Simple add", () => {
    const left = parsePairs("[[[[4,3],4],4],[7,[[8,4],9]]]");
    const right = parsePairs("[1,1]");
    const result = add(left, right);

    assertEquals(result.toString(), "[[[[0,7],4],[[7,8],[6,0]]],[8,1]]");
});

Deno.test("Simple 1-5", () => {
    const list = ["[2,2]", "[3,3]", "[4,4]", "[5,5]"];
    let sum = parsePairs("[1,1]")
    for (const next of list) {
        sum = add(sum, parsePairs(next));
    }

    assertEquals(sum.toString(), "[[[[3,0],[5,3]],[4,4]],[5,5]]");
});

Deno.test("Simple add 1-6", () => {
    const list = ["[2,2]", "[3,3]", "[4,4]", "[5,5]", "[6,6]"];
    let sum = parsePairs("[1,1]")
    for (const next of list) {
        sum = add(sum, parsePairs(next));
    }

    assertEquals(sum.toString(), "[[[[5,0],[7,4]],[5,5]],[6,6]]");
});

Deno.test("Complex add", () => {
    const left = parsePairs("[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]");
    const right = parsePairs("[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]");
    const result = add(left, right);

    assertEquals(result.toString(), "[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]");
});

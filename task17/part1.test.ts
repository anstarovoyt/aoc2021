import {parseInitialData, getProbeMaxY} from "./task17-common.ts";
import {assert, assertEquals} from "https://deno.land/std@0.111.0/testing/asserts.ts";

Deno.test("Parse cords", () => {
    const range = parseInitialData("target area: x=20..30, y=-10..-5");
    assertEquals(range.x1, 20);
    assertEquals(range.x2, 30);
    assertEquals(range.y1, -10);
    assertEquals(range.y2, -5);
});

Deno.test("Probe", () => {
    const range = parseInitialData("target area: x=20..30, y=-10..-5");
    assert(getProbeMaxY(7, 2, range));
    assert(getProbeMaxY(6, 3, range));
    assert(getProbeMaxY(9, 0, range));
    assert(!getProbeMaxY(17, -4, range));
});

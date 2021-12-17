import {parseInitialData} from "./task17-common.ts";
import {assertEquals} from "https://deno.land/std@0.111.0/testing/asserts.ts";

Deno.test("Parse cords", () => {
    const range = parseInitialData("target area: x=20..30, y=-10..-5");
    assertEquals(range.x1, 20);
    assertEquals(range.x2, 30);
    assertEquals(range.y1, -10);
    assertEquals(range.y2, -5);
});

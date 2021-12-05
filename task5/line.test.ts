import {Line} from "./line.ts";
import {assertEquals} from "https://deno.land/std@0.117.0/testing/asserts.ts";

Deno.test("parsing cords", () => {
    const line = new Line("0,9 -> 5,9");
    assertEquals(line.x1, 0);
    assertEquals(line.y1, 9);
    assertEquals(line.x2, 5);
    assertEquals(line.y2, 9);
});
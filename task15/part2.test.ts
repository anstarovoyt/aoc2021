import {assertEquals} from "https://deno.land/std@0.111.0/testing/asserts.ts";
import {parseDataAsGrid, readTextBuffer} from "../common/util.ts";
import {extendGrid} from "./extendGrid.ts";

Deno.test("extend grid", () => {
    const originalData = readTextBuffer(import.meta.url, [".test.ts", "_test.txt"]);
    const originalGrid = parseDataAsGrid(originalData);
    const extendedData = readTextBuffer(import.meta.url, [".test.ts", "_test_result.txt"]);
    const extendedGrid = parseDataAsGrid(extendedData);
    const afterExtensionGrid = extendGrid(originalGrid);

    assertEquals(afterExtensionGrid, extendedGrid)
});

import {assert, assertEquals} from "https://deno.land/std@0.111.0/testing/asserts.ts";
import {
    LiteralPackage,
    OperatorPackage,
    parseLiteral,
    parsePackages,
    splitHeader,
    toBinaryString
} from "./task16-common.ts";

Deno.test("Convert HEX string", () => {
    const hex = "38006F45291200";
    assertEquals(toBinaryString(hex), "00111000000000000110111101000101001010010001001000000000");
});

Deno.test("Header", () => {
    const hex = "38006F45291200";
    const [version, typeId, other] = splitHeader(toBinaryString(hex));
    assertEquals(version, "001");
    assertEquals(typeId, "110");
    assertEquals(other, "00000000000110111101000101001010010001001000000000");
});

Deno.test("Literal", () => {
    const hex = "D2FE28";
    const bin = toBinaryString(hex);
    const [version, typeId, other] = splitHeader(bin);
    assertEquals(version, "110");
    assertEquals(typeId, "100");

    const [literal, length] = parseLiteral(other);
    assertEquals(literal, 2021);
    assertEquals(length, "AAAAABBBBBCCCCC".length);

    const parsed = parsePackages(bin);
    assert(parsed instanceof LiteralPackage);
    assertEquals(parsed.value, 2021);
    assertEquals(parsed.totalLength, "VVVTTTAAAAABBBBBCCCCC".length);
})

Deno.test("Sub packages with total length in bits", () => {
    const parsed = parsePackages(toBinaryString("38006F45291200"));

    assert(parsed instanceof OperatorPackage);
    assertEquals(parsed.totalLength, "VVVTTTILLLLLLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBBBBBB".length);
    assertEquals(parsed.packages.length, 2);
    const firstPack = parsed.packages[0];
    assert(firstPack instanceof LiteralPackage);
    assertEquals(firstPack.value, 10);
    const secondPack = parsed.packages[1];
    assert(secondPack instanceof LiteralPackage);
    assertEquals(secondPack.value, 20);
})

Deno.test("Sub packages with number of sub-packets immediately contained", () => {
    const parsed = parsePackages(toBinaryString("EE00D40C823060"));

    assert(parsed instanceof OperatorPackage);
    assertEquals(parsed.totalLength, "VVVTTTILLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC".length);
    assertEquals(parsed.packages.length, 3);
    const firstPack = parsed.packages[0];
    assert(firstPack instanceof LiteralPackage);
    assertEquals(firstPack.value, 1);

    const secondPack = parsed.packages[1];
    assert(secondPack instanceof LiteralPackage);
    assertEquals(secondPack.value, 2);

    const thirdPack = parsed.packages[2];
    assert(thirdPack instanceof LiteralPackage);
    assertEquals(thirdPack.value, 3);
})



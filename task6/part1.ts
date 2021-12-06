import {readTextBuffer} from "../util.ts";

const data = readTextBuffer(import.meta.url);
const numbers = data.split(",").map(Number);
const days = 80;

let currentArray = numbers;
for (let _i = 0; _i < days; _i++) {
    let toAdd = 0;
    const newArray = [];
    for (let i = 0; i < currentArray.length; i++) {
        const number = currentArray[i];
        const isZero = number == 0;
        const newNumber = isZero ? 6 : number - 1;
        newArray.push(newNumber);
        if (isZero) toAdd++;
    }
    for (let i = 0; i < toAdd; i++) {
        newArray.push(8);
    }
    currentArray = newArray;
}

console.log(currentArray.length);
Deno.exit();



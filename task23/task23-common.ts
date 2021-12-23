export type Letters = (string | undefined)[];
export const letters = ["A", "B", "C", "D"];

export function parseInput(text: string): Letters {
    const result = [] as Letters;
    for (const el of text) {
        if (el == '.') {
            result.push(undefined);
        } else if (letters.includes(el)) {
            result.push(el);
        }
    }

    return result;
}

export const forbiddenHallway = [2, 4, 6, 8];

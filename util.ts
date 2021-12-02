export function readTextBuffer(importInfo: string): string {
    const pathName = new URL(importInfo).pathname;
    const newPath = pathName.replace(".ts", ".txt");
    try {
        Deno.statSync(newPath)
    } catch (e) {
        console.log("File doesn't exist");
        throw e;
    }
    return Deno.readTextFileSync(newPath).trim();
}

export function split(buffer: string): string[] {
    return buffer.split("\n");
}

export function readNumbers(buffer: string): number[] {
    return split(buffer).map(Number);
}
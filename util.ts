export function readTextBuffer(importInfo: string): string {
    const pathName = new URL(importInfo).pathname;
    const newPath = pathName.replace(".ts", ".txt");
    if (Deno.statSync(newPath) == null) throw Error("File doesn't exist");
    return Deno.readTextFileSync(newPath).trim();
}

export function readNumbers(buffer: string): number[] {
    return buffer.split("\n").map(Number);
}
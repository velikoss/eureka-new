import fs from "node:fs/promises";
const file = await fs.readFile(".git/packed-refs");
export const commit = () => {
    return file.toString().split("\n")[1].substring(0,7);
}
import fs from "node:fs/promises";
const file = await fs.readFile(".git/FETCH_HEAD");

export const commit = () => {
    return file.toString().substring(0,7);
}
export let commitDate = async () => {
    return await fs.stat(".git/index");
}
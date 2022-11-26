import fs from "fs";


export const removePath = async (path) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
    }
}
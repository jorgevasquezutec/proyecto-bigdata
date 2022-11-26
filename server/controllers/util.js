import { getFileStreamContentType } from "../config/s3.js";


export async function getFile(req, res) {
    const key = req.params.key;
    const readStrem = getFileStreamContentType(key,'video/webm',);
    readStrem.pipe(res);
}



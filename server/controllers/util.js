import { getFileStreamContentType } from "../config/s3.js";


export async function getFile(req, res) {
    try {
        const key = req.params.key;
        const readStrem = getFileStreamContentType(key,'video/webm',res);
        readStrem.pipe(res);
    } catch (error) {
        console.log("ISERROR",error);
    }
   
}



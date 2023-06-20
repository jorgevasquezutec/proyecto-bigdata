import { deleteFile } from "../config/s3.js";
import { io } from "../app.js"
import { removePath } from "./util.js";
import { getLoginInfo } from "./userService.js";
import InMemorySessionStore from './sesionStore.js'

export const loginCallback = async (event, topic) => {

    const { user_id,
        first_video,
        any_video,
        any_video_key,
        sessionID,
        file_path,
        error
    } = event;

    console.log("event", event)
    
    await removePath(file_path);
    await deleteFile(any_video_key);

    const session = InMemorySessionStore.findSession(sessionID);

    if (topic === 'checked') {
        // console.log("checked", event);
        io.to(session.userID).emit("login_success", {
            message : "Video procesado correctamente",
            data : await getLoginInfo(user_id)
        });
    }
    if (topic === 'celery') {
        // console.log("celery", event);
        io.to(session.userID).emit("login_failed", {
            message : event.error || "Ocurrio un error al procesar el video"
        });
    }

}
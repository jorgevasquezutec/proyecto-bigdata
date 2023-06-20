
import InMemorySessionStore from "../services/sesionStore.js";

const handler = (io, socket) => {

    InMemorySessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: true,
    });
    socket.join(socket.userID);

    socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.userID,
    });

    // console.log(InMemorySessionStore.findAllSessions());

    // notify users upon disconnection
    socket.on("disconnect", async () => {
        const matchingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            InMemorySessionStore.saveSession(socket.sessionID, {
                userID: socket.userID,
                username: socket.username,
                connected: false,
            });
        }
    });
}

export default handler;
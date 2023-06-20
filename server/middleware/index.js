import InMemorySessionStore from "../services/sesionStore.js";
import crypto from 'crypto';

const randomId = () => crypto.randomBytes(8).toString("hex");

const middleware = async (io, socket) => {

    const sessionID = socket.handshake.auth.sessionID;
    if(sessionID){
        const session = InMemorySessionStore.findSession(sessionID);
        if(session){
            socket.sessionID = sessionID;
            socket.userID = session.userID;
            socket.username = session.username;
            return next();
        }
    }
    const username = socket.handshake.auth.username;
    if(!username){
        return next(new Error("invalid username"));
    }
    socket.sessionID = randomId();
    socket.userID = randomId();
    socket.username = username;
    next();

}

export default middleware;
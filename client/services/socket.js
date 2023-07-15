import { io } from "socket.io-client";


// const API = "http://localhost/server/";
// console.log(API)

const socket = io("", { 
  autoConnect: false,
  rejectUnauthorized: false
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
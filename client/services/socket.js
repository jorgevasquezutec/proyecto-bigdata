import { io } from "socket.io-client";
import getConfig from "next/config";

const API_URL = getConfig().publicRuntimeConfig.APIURL;
const socket = io(API_URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
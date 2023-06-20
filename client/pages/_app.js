import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useEffect } from 'react';
import { parse, serialize } from 'cookie';
import socket from '../services/socket';


function generateGlobalCookieValue() {
  const randomNumber = Math.floor(Math.random() * 1000000);
  return `user_${randomNumber}`;
}

function cookieSession() {
  const cookies = parse(document.cookie);
  let  username = cookies.globalCookie;
  if (!username) {
    // Generate a new value for the global cookie
    username = generateGlobalCookieValue(); // Replace this with your logic to generate a unique value
    
    // Set the global cookie with an expiration date, for example, 30 days from now
    document.cookie = serialize('globalCookie', newGlobalCookie, { path: '/', maxAge: 30 * 24 * 60 * 60 });
  }
  socket.auth = { username };
  socket.connect();
}

function connect (){

  const sessionID = localStorage.getItem("sessionID");

  if (sessionID) { 
    socket.auth = { sessionID };
    socket.connect();
  }else {
    cookieSession();
  }

  socket.on("session", ({ sessionID, userID }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID };
    // store it in the localStorage
    localStorage.setItem("sessionID", sessionID);
    // save the ID of the user
    socket.userID = userID;
  });
  socket.on("connect_error", (err) => {
    // console.log(err.message);
    if (err.message === "invalid username") {
      cookieSession();
    }
  });
  
}



export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {

  useEffect(() => {
    connect();
  }, []);

  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </Provider>
  )
}
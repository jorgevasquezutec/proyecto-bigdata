import {
    startServer
} from './app.js';

await startServer().then(async (PORT) => {
    console.log("Server running on port: ", PORT);
}).catch((error) => {
    console.log(error);
});
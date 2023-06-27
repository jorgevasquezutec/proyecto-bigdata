import {
    startServer
} from './app.js';


try {

    await startServer().then(async (PORT) => {
        console.log("Server running on port: ", PORT);
        // logger.info({
        //     message: `Server running on port: ${PORT}`,
        // });
        // log.info("Server running on port: ", PORT);
    }).catch((error) => {
        console.log(error);
    });
    
} catch (error) {
    console.log(error);
}


import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { register, login } from './controllers/auth.js';
import { getFile } from './controllers/util.js';
import { MONGO_URL, PORT } from './config/app.js';
import { makeConsumer } from './config/kafka.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import socketMidleware from './middleware/index.js'
import { HANDLERS } from './socket/index.js';
import { loginCallback } from './services/callback.js';
import logger from './config/winston.js';


global.logger = logger;


/*CONFIGURATIONS*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));


/*FILE STORAGE */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/videos');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

/*ROUTERS*/

app.post("/auth/signup", upload.single("first_video"), register)
app.use("/auth/login", upload.single("any_video"), login);
app.get("/videos/:key", getFile);

let http;
let io;

const startServer = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }, (error) => {
            if (error) {
                logger.error(error);
                reject(error);
            } else {
                console.log("MongoDB connected");
                // const http = require('http').createServer(app);
                http = createServer(app);
                io = new Server(http, {
                    cors: {
                        origin: '*',
                        methods: ["GET", "POST"]
                    }
                });
                io.use( socketMidleware );
                const onConnection = async (socket) => {
                    console.log('connected to socket!');
                    HANDLERS.forEach((handler) => handler(io, socket));
                }
                io.on("connection", onConnection);
                http.listen(PORT, () => {
                    resolve(PORT);
                });
                makeConsumer(['checked', 'celery'],loginCallback).then((consumer) => {
                    console.log("consumer Running");
                });
            }
        });
    });
};

export { app, http, io, startServer };

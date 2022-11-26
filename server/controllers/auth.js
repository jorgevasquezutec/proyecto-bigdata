import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendProducer, makeConsumer } from "../config/kafka.js";
import { uploadFile, deleteFile } from "../config/s3.js";
import dotenv from "dotenv";
import { removePath } from "../services/util.js";



dotenv.config();




/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            userName,
            password,
            videoPath,
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const file = req.file;
        await uploadFile(file);
        const newUser = new User({
            firstName,
            lastName,
            email,
            userName,
            password: passwordHash,
            videoPath,
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        await unlinkAsync(req.file.path);
        res.status(500).json({ error: err.message });
    }
};



/* LOGGING IN */
export const login = async (req, res) => {
    try {

        /*Verirfy password */
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            await removePath(req.file.path);
            return res.status(400).json({ error: "User does not exist. " });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await removePath(req.file.path);
            return res.status(400).json({ error: "Invalid credentials. " });
        }

        const any_video = req.file;
        const any_video_key = any_video.originalname;

        /*Upload any_video s3*/
        await uploadFile(any_video);

        /*Send payload to kafka*/
        await sendProducer("loginattempt", {
            username: user.userName,
            first_video: `${process.env.API_URL}/video/${user.videoPath}`,
            any_video: `${process.env.API_URL}/video/${any_video_key}`,
        });

        /*Receive payload from kafka*/
        const result = await makeConsumer(['checked', 'celery'], user);
        const consumer = result?.consumer;
        if (consumer) await consumer.disconnect();

        /*Delete any_video s3*/
        await deleteFile(any_video_key);

        /*response to client*/
        if (result.status) {
            await removePath(req.file.path);
            if (result.topic === 'checked') {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
                delete user.password;
                return res.status(200).json({ token, user });
            }
            return res.status(4001).json({ error: "Error in video process" });
        }
        else {
            throw new Error(result.error)
        }

    } catch (err) {
        console.log(err);
        await removePath(req.file.path);
        // await unlinkAsync(req.file.path,(err)=>{console.log(err)});
        res.status(500).json({ error: err.message });
    }
};
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import fs from "fs";
import { promisify } from "util";
import { sendProducer, makeConsumer } from "../config/kafka.js";

const unlinkAsync = promisify(fs.unlink)

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
        // console.log(req.file)
        const { email, password } = req.body;
        // console.log(email, password)
        const user = await User.findOne({ email: email });
        if (!user) {
            await unlinkAsync(req.file.path);
            return res.status(400).json({ error: "User does not exist. " });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await unlinkAsync(req.file.path);
            return res.status(400).json({ error: "Invalid credentials. " });
        }
        /* PRODUCER*/
        await sendProducer("loginattempt", {
            username: user.userName,
            first_video: user.videoPath,
            any_video: req.file.originalname,
        });

        const result = await makeConsumer(['checked', 'celery'], user);
        const consumer = result?.consumer;
        if(consumer) await consumer.disconnect();
        if (result.status) {
            await unlinkAsync(req.file.path)
            if(result.topic === 'checked'){
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
        await unlinkAsync(req.file.path);
        res.status(500).json({ error: err.message });
    }
};
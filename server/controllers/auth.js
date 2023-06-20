import bcrypt from "bcrypt";

import User from "../models/User.js";
import { sendProducer } from "../config/kafka.js";
import { uploadFile } from "../config/s3.js";
import  {API_URL} from "../config/app.js";
import { removePath } from "../services/util.js";



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
        const { email, password, sessionID } = req.body;
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
            user_id : user._id,
            first_video: `${API_URL}/videos/${user.videoPath}`,
            any_video: `${API_URL}/videos/${any_video_key}`,
            any_video_key: any_video_key,
            sessionID: sessionID,
            file_path : req.file.path
        });
        
        return res.status(200).json({
            status: 'in progress',
            message: 'Please wait for the video to be processed',
        });

    } catch (err) {
        console.log(err);
        await removePath(req.file.path);
        res.status(500).json({ error: err.message });
    }
};
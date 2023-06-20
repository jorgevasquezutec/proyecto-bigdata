
import {
    JWT_SECRET
} from '../config/app.js';
import User from '../models/User.js';
import jwt from "jsonwebtoken";

export const getLoginInfo = async (user_id) => {

    const user = await User.findById(user_id);
    const token = jwt.sign({ id: user_id }, JWT_SECRET);
    delete user.password;
    return { token, user };
};
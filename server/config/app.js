import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGO_URL = process.env.MONGO_URL;
export const BROKERS = process.env.BROKERS.split(',');
export const JWT_SECRET = process.env.JWT_SECRET;
export const API_URL = process.env.API_URL;
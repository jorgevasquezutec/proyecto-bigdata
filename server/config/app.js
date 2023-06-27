import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGO_URL = process.env.MONGO_URL;
export const BROKERS = process.env.BROKERS.split(',');
export const JWT_SECRET = process.env.JWT_SECRET;
export const API_URL = process.env.API_URL;
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
export const AWS_CLOUDWATCH_LOG_GROUP = process.env.AWS_CLOUDWATCH_LOG_GROUP;
export const APP_ENV = process.env.APP_ENV;
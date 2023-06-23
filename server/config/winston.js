import winston from "winston";
import WinstonCloudwatch from "winston-cloudwatch";
import {
    AWS_BUCKET_REGION,
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    AWS_CLOUDWATCH_LOG_GROUP,
    APP_ENV
} from "./app.js";



const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(
            {
              format: 'YYYY-MM-DD HH:mm:ss'
            }
          )
        ),
      }),
    ]
  });
  

if (APP_ENV === 'production') {

    const cloudwatchConfig = {
      logGroupName: AWS_CLOUDWATCH_LOG_GROUP,
      logStreamName: `${AWS_CLOUDWATCH_LOG_GROUP}-${APP_ENV}`,
      
    }
    logger.add(new WinstonCloudwatch({
        ...cloudwatchConfig,
        awsOptions : {
            region: AWS_BUCKET_REGION,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY,
                secretAccessKey: AWS_SECRET_KEY
            }
        },
        jsonMessage: true,
        awsRegion: AWS_BUCKET_REGION
    }));
  }
  
// global.logger = logger;
export default logger;
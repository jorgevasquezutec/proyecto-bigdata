
import fs from 'fs';
import S3 from 'aws-sdk/clients/s3.js';
import dotenv from 'dotenv';
dotenv.config();


const bucketName=process.env.AWS_BUCKET_BAME;
const region=process.env.AWS_BUCKET_REGION;
const accessKeyId=process.env.AWS_ACCESS_KEY;
const secretAccessKey=process.env.AWS_SECRET_KEY;

const s3=  new S3({
    region,
    accessKeyId,
    secretAccessKey
})

// uploads a file to s3
async function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path)
  
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename,
      ContentType: file.mimetype,
    }
    let data = await s3.upload(uploadParams).promise();
    fs.unlink(file.path,function(err){
      if(err){
        console.log(err);
      }
      console.log('Temp File Delete');
    })
    return data;
}


// downloads a file from s3
function getFileStreamContentType(fileKey,contentType) {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName,
      ResponseContentType:contentType
    }
  
    return s3.getObject(downloadParams).createReadStream()
  }

function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }
  let data = s3.getObject(downloadParams,function(err, data){
    if (err) {console.log(err, err.stack)}
    else {console.log(data);} 
  }).createReadStream()
  return data;
}


  
module.exports ={
  uploadFile,
  getFileStream,
  getFileStreamContentType
}

//download  a file from s3
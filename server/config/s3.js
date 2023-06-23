
import fs from 'fs';
import S3 from 'aws-sdk/clients/s3.js';
import  {
  AWS_BUCKET_BAME,
  AWS_BUCKET_REGION,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY
} from "./app.js";


const bucketName =AWS_BUCKET_BAME;
const region = AWS_BUCKET_REGION;
const accessKeyId = AWS_ACCESS_KEY;
const secretAccessKey = AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
export async function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
    ContentType: file.mimetype,
  }
  let data = await s3.upload(uploadParams).promise();
  fs.unlink(file.path, function (err) {
    if (err) {
      console.log(err);
    }
    console.log('Temp File Delete');
  })
  return data;
}


// downloads a file from s3
export function getFileStreamContentType(fileKey, contentType,res) {

  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
    ResponseContentType: contentType
  }
  return s3.getObject(downloadParams).createReadStream().on('error', function () {
    res.status(404).send('File not found');
   })
  // .pipe(res);

}

export function deleteFile(fileKey) {
  const deleteParams = {
    Key: fileKey,
    Bucket: bucketName,
  }
  return s3.deleteObject(deleteParams).promise()
}

export function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }
  let data = s3.getObject(downloadParams, function (err, data) {
    if (err) { console.log(err, err.stack) }
    else { console.log(data); }
  }).createReadStream()
  return data;
}


//download  a file from s3
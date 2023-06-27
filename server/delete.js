
// import {deleteFile} from "./config/s3.js";
import bcrypt from "bcrypt";

const salt = await bcrypt.genSalt();
const passwordHash = await bcrypt.hash("aveces", salt);

console.log(passwordHash);


// const deleteTest = async () => {
//     try {
    
//         await deleteFile("aSci9QRXDa2OQgtPr3iMENNGuIRz6dTn5W8MAkIhro7Rcjt4gDKI1DS8qcUZyoKy.webm");
//         // Realiza más operaciones o lógica aquí después de una conexión exitosa
//     } catch (error) {
//         console.error('Error ', error);
//     } finally {
//         // await consumer.disconnect();
//     }
// };

// deleteTest();
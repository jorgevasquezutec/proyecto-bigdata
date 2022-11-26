export const blobToBase64 = (blob) => {
    return new Promise( (resolve, reject) =>{
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            // console.log(reader.result)
            resolve(reader.result);
            // "data:image/jpg;base64,    =sdCXDSAsadsadsa"
        };
    });
};


export const b64ToBlob = async(b64, type)=>{
    // console.log(b64)
    // const blob = await fetch(b64);
    return b64;
};
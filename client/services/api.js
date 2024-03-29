import axios from 'axios';
// import getConfig from "next/config";

const header = {
    headers : {
        'Content-Type': 'application/json',
    }
}
// const API_URL = getConfig().publicRuntimeConfig.API_URL;


export const ApiRegister = async (paylaod) => {
    return new Promise(async(resolve, reject) => {
        try {
            const res = await axios.post(`/server/auth/signup`, paylaod)
            resolve(res)
        } catch (error) {
            reject(error)
        }
    })
}

export const ApiLogin = async (paylaod) => {
    return new Promise(async(resolve, reject) => {
        try {
            const res = await axios.post(`/server/auth/login`, paylaod)
            resolve(res)
        } catch (error) {
            reject(error)
        }
    })
}
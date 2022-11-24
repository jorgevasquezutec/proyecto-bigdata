import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios";
import FormData from "form-data";
import cryptoRandomString from 'crypto-random-string';


const coreLogin = async ({ email, password, any_video, }) => {
  try {
    const formData = new FormData();
    formData.append("email",email);
    formData.append("password",password);
    const videoName = cryptoRandomString({ length: 64, type: 'alphanumeric' }) + ".webm";
    formData.append("any_video", any_video, videoName);
    const res = await axios.post(`${process.env.API_URL}/auth/login`, formData);
    return res.data;

  } catch (error) {
    const errorMessage = error?.response?.data?.error || "Something went wrong";
    throw new Error(errorMessage);
  }
}



export const authOptions = {
  // Configure one or more authentication providers
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        return await coreLogin(credentials);
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    jwt(params) {
      // update token
      if (params.user?.role) {
        params.token.role = params.user.role;
      }
      // return final_token
      return params.token;
    },

  }
}
export default NextAuth(authOptions)
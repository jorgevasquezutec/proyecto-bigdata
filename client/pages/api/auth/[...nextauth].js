import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"


export const authOptions = {
  // Configure one or more authentication providers
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(data, req) {
        if(!data?._id) throw new Error("Something went wrong");
        return {
          id : data?._id,
          name: `${data.firstName} ${data.lastName}`,
          email: data?.email,
          token: data?.token,
        }
        // return {
        //   id: "1",
        //   name: "John Doe",
        //   email: "test@email.com"
        // }
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
      if (params.user?.token) {
        params.token.token = params.user.token;
      }
      // return final_token
      return params.token;
    },

  }
}
export default NextAuth(authOptions)
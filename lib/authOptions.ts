import { NextAuthOptions, User as AdapterUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// Extend the User interface to include the 'id' field
interface ExtendedUser extends AdapterUser {
  id: string;
}

// Extend the Session interface to include ExtendedUser

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt", // Ensures sessions are managed using JWT
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user.id to token if it exists (on first sign in)
      if (user) {
        token.id = (user as ExtendedUser).id; // Cast user to ExtendedUser
      }
      return token;
    },
    async session({ session, token }) {
      // Ensure session.user has an id from the token
      if (token.id) {
        (session.user as ExtendedUser).id = token.id as string; // Cast session.user to ExtendedUser
      }
      return session;
    },
  },
};

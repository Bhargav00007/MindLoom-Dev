import { NextAuthOptions, User as AdapterUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import connectToDB from "../lib/config/db"; // adjust the path if needed
import User from "../lib/models/user";

// Extend the User interface to include the 'id' field
interface ExtendedUser extends AdapterUser {
  id: string;
}

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
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      try {
        await connectToDB();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
          console.log("🆕 New user created:", user.email);
        } else {
          console.log("✅ User already exists:", user.email);
        }

        return true;
      } catch (error) {
        console.error("❌ Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token }) {
      await connectToDB();

      const dbUser = await User.findOne({ email: token.email });

      if (dbUser) {
        token.id = dbUser._id.toString(); // ✅ MongoDB ObjectId
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        (session.user as ExtendedUser).id = token.id as string;
      }
      return session;
    },
  },
};

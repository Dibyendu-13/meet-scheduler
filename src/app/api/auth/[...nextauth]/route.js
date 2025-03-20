import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextResponse } from "next/server";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/calendar.events",
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token || null;
                token.refreshToken = account.refresh_token || null;
                token.idToken = account.id_token || null;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.idToken = token.idToken;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/signin",
    },
};

// ✅ Ensure NextAuth uses the correct format for Next.js App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

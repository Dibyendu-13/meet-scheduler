import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
                    response_type: "code", // Explicitly request id_token
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token || null;
                token.refreshToken = account.refresh_token || null;
                token.idToken = account.id_token || null; // Ensure id_token is stored safely
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.idToken = token.idToken; // Pass id_token to session
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

// ✅ Properly export GET and POST for App Router
export const GET = async (req) => NextAuth(authOptions)(req);
export const POST = async (req) => NextAuth(authOptions)(req);

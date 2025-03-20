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
                    response_type: "code", // Ensures we get id_token
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.idToken = account.id_token; // Store id_token
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

// ✅ Ensure NextAuth uses named exports for Next.js App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

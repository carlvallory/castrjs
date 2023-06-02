import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { refreshToken } from "@/pages/utils/refreshToken";

const useSecureCookies = !!process.env.VERCEL_URL

export const authOptions = {
    providers: [
        GoogleProvider({
          clientId: process.env.YOUTUBE_CLIENT_ID,
          clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
          scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
            }
          }
        })
      ],
    secret: process.env.JWT_SECRET,
    jwt: {
      encryption: true
    },
    callbacks: {
      async jwt({ token, user, account }) {
        // Persist the OAuth access_token to the token right after signin
        if (account) {
          token.accessToken = account.access_token;
        }
        if (account?.provider) {
          token.provider = account.provider;
        }
        if (user) {
          const refresh_token = await refreshToken(user);
          // Add the refresh token to the JWT token
          token.refreshToken = refresh_token;
        }
        return Promise.resolve(token);
      },
      async session({ session, token, user }) {
        // Retrieve the refresh token
        //const refresh_token = await refreshToken(user);

        // Send properties to the client, like an access_token from a provider.
        session.accessToken = token.accessToken;
        session.provider = token.provider;
        //session.user.refreshToken = refresh_token;
        return Promise.resolve(session);
      },
    },
    cookies: {
      sessionToken: {
        name: `${useSecureCookies ? '__Secure-' : ''}next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: useSecureCookies,
        },
      },
    },
    debug: true,
};

const handler = NextAuth(authOptions);
//export { handler as GET, handler as POST }
export default handler;
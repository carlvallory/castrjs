import { useSession, signOut, getSession } from "next-auth/react"
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { google } from "googleapis";

const GOOGLE_CLIENT_ID      = process.env.YOUTUBE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET  = process.env.YOUTUBE_CLIENT_SECRET;
const GOOGLE_AUTH_REDIRECT  = process.env.GOOGLE_AUTH_REDIRECT;
const NEXTAUTH_URL          = process.env.NEXTAUTH_URL;
const REDIRECT_URI          = NEXTAUTH_URL + "/" + GOOGLE_AUTH_REDIRECT;
const YOUTUBE_FORCE_SSL     = "https://www.googleapis.com/auth/youtube.force-ssl";

const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);

export async function GET(request) {
  const session = await getSession({ request });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' });
  }

  const { token, user } = session;

  const authUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "online",
    scope: [YOUTUBE_FORCE_SSL],
  });

  const { codeVerifier, codeChallenge } = await oauth2Client.generateCodeVerifierAsync(); 

  const cookieStore = cookies();
  cookieStore.getAll().map((cookie) => (
    console.log(cookie.name),
    console.log(cookie.value)
  ));

  return NextResponse.json({ authUrl, codeVerifier, codeChallenge, token, user });
};

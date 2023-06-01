import { NextResponse } from "next/server";
import { google } from "googleapis";

const GOOGLE_CLIENT_ID      = process.env.YOUTUBE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET  = process.env.YOUTUBE_CLIENT_SECRET;
const GOOGLE_AUTH_REDIRECT  = process.env.GOOGLE_AUTH_REDIRECT;
const NEXTAUTH_URL          = process.env.NEXTAUTH_URL;
const REDIRECT_URI          = NEXTAUTH_URL + "/" + GOOGLE_AUTH_REDIRECT;

const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);

export async function GET(request) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });

  return NextResponse.json({ authUrl });
};

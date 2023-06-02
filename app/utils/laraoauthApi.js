import axios from "axios";

const API_KEY = process.env.YOUTUBE_API_KEY;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const GOOGLE_AUTH_REDIRECT = process.env.GOOGLE_AUTH_REDIRECT;

const laratubeURL = NEXTAUTH_URL + "/" + GOOGLE_AUTH_REDIRECT;

export const laraoauthApi = axios.create({
    baseURL: laratubeURL,
    params:
    {
        key: API_KEY
    },
});
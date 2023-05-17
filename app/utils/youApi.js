import axios from "axios";

const API_KEY = process.env.YOUTUBE_API_KEY;

export const youApi = axios.create({
    baseURL:'https://www.googleapis.com/youtube/v3',
    params:
    {
        part:'snippet',
        maxResults:5,
        key: API_KEY
    },
});

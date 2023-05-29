import axios from "axios";

const API_KEY = process.env.YOUTUBE_API_KEY;

export const laratubeApi = axios.create({
    baseURL:'https://phplaravel-937280-3562147.cloudwaysapps.com/youtube',
    params:
    {
        key: API_KEY
    },
});

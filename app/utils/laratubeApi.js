import axios from "axios";

const API_KEY = process.env.YOUTUBE_API_KEY;
const laratubeURL = "https://phplaravel-937280-3562147.cloudwaysapps.com/youtube";

export const laratubeApi = axios.create({
    baseURL: laratubeURL,
    params:
    {
        key: API_KEY
    },
});

laratubeApi.interceptors.response.use(response => {
    return response.headers['content-type'] === 'application/json' ? response : Promise.reject(response);
}, error => Promise.reject(error));
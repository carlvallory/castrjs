import axios from "axios";

const STREAMID = process.env.CASTR_STREAM_ID;
const PLATFORMID = process.env.CASTR_PLATFORM_ID;

export const castrApi = axios.create({
  baseURL: "https://developers.castr.io/apiv1/",
  headers: {
    'x-api-key': process.env.CASTR_API_KEY,
  },
});
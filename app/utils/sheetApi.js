import axios from "axios";

export const APIKEY = process.env.GOOGLE_SHEET_API_KEY;
export const SHEETID = process.env.GOOGLE_SHEET_ID;

export const sheetApi = axios.create({
  baseURL: "https://sheets.googleapis.com/v4/",
});
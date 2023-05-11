import axios from "axios";

export const platformApi = axios.create({
  baseURL: "http://localhost:3083/api/platform/",
});
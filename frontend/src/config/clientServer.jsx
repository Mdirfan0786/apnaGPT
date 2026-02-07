import axios from "axios";

export const BASE_URL = import.meta.env.VITE_LOCAL_SERVER;

export const clientServer = axios.create({
  baseURL: BASE_URL,
});

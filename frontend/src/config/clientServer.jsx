import axios from "axios";

export const BASE_URL = "http://localhost:7870/api";

export const clientServer = axios.create({
  baseURL: BASE_URL,
});

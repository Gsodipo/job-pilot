// frontend/src/api/client.ts
import axios from "axios";
import { getAuthToken } from "./token";

export const API_BASE =
  import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE,
});

// ✅ Attach Clerk token automatically
api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

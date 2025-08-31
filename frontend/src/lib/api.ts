// Path: frontend/src/lib/api.ts
import axios from "axios";
import { useAuthStore } from "../store/auth";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1", // Make sure your backend runs on this port
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

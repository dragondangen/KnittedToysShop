import axios from "axios";
import type { Toy, ToyCreate } from "@/types/toy";
import { useAuthStore } from "./auth-store";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5136";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? useAuthStore.getState().token : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const url = err.config?.url ?? "";
      if (!String(url).includes("/api/Auth/login")) {
        useAuthStore.getState().logout();
        if (typeof window !== "undefined")
          window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export const getToys = () => api.get<Toy[]>("/api/Toys");
export const getToyById = (id: number) => api.get<Toy>(`/api/Toys/${id}`);
export const createToy = (data: ToyCreate) =>
  api.post<Toy>("/api/Toys", data);
export const updateToy = (id: number, data: Toy) =>
  api.put(`/api/Toys/${id}`, data);
export const deleteToy = (id: number) => api.delete(`/api/Toys/${id}`);

export const login = (userName: string, password: string) =>
  api.post<{ token: string }>("/api/Auth/login", { userName, password });

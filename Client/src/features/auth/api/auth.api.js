import { authApi, api } from "@/config/api";

export function register(payload) {
  return authApi.post("/auth/register", payload).then((res) => res.data.data);
}

export function login(payload) {
  return authApi.post("/auth/login", payload).then((res) => res.data.data);
}

export function refresh() {
  return authApi.post("/auth/refresh").then((res) => res.data.data);
}

export function logout() {
  return authApi.post("/auth/logout");
}

export function getMe() {
  return api.get("/auth/me").then((res) => res.data.data);
}

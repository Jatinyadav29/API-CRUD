import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const authApi = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

const AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];

let refreshPromise = null;

export function setupInterceptors(store) {
  api.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalConfig = error.config;

      const isAuthEndpoint = AUTH_PATHS.some((p) =>
        originalConfig.url?.includes(p),
      );

      if (
        error.response?.status === 401 &&
        !originalConfig._retry &&
        !isAuthEndpoint
      ) {
        originalConfig._retry = true;

        try {
          if (!refreshPromise) {
            refreshPromise = authApi
              .post("/auth/refresh")
              .then((res) => res.data.data.accessToken)
              .finally(() => {
                refreshPromise = null;
              });
          }

          const newToken = await refreshPromise;

          const { setAccessToken } =
            await import("@/features/auth/state/authSlice");
          store.dispatch(setAccessToken(newToken));

          originalConfig.headers.Authorization = `Bearer ${newToken}`;
          return api(originalConfig);
        } catch {
          const { clearSession } =
            await import("@/features/auth/state/authSlice");
          store.dispatch(clearSession());
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    },
  );
}

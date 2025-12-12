// src/utils/api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "/";


export const api = axios.create({
  baseURL: API_BASE,
  // we won't set credentials globally for all requests (to avoid sending cookies to public endpoints),
  // but we will set withCredentials for refresh call explicitly when needed.
});

// helper to read/set access token in localStorage (or you can keep in memory)
export const getAccessToken = () => localStorage.getItem("accessToken");
export const setAccessToken = (token) => {
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");
};

// Request interceptor: attach access token to Authorization header
api.interceptors.request.use((cfg) => {
  const token = getAccessToken();

  if (token) {
    cfg.headers = {
      ...cfg.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return cfg;
});


// Response interceptor: on 401 try refresh once and retry
let isRefreshing = false;
let refreshPromise = null;

api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // Avoid infinite loop; only try once
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          // call refresh endpoint which will use HttpOnly refresh cookie
          refreshPromise = axios.post(
            `${API_BASE}api/auth/refresh`,
            {},
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        const refreshResp = await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;

        const newAccessToken = refreshResp.data.token;
        setAccessToken(newAccessToken);

        // update Authorization header and retry original request
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axios(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        refreshPromise = null;
        setAccessToken(null);
        // optionally you can redirect to login here, or let the app handle it
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_BASE };

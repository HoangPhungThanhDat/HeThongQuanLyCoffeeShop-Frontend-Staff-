import axios from "axios";

const BASE_URL = "/api";
const PORTAL = "staff";   // ✅ STAFF

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken = null;
export const setAccessToken = (token) => (accessToken = token);
export const getAccessToken = () => accessToken;
export const clearAccessToken = () => (accessToken = null);

axiosClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============ ✅ CHUNG 1 PROMISE CHO TẤT CẢ ============
let refreshPromise = null;

/**
 * ✅ EXPORT hàm này để AuthAPI dùng chung Promise
 * Khi cả App.jsx và interceptor cùng gọi → CHỈ 1 request HTTP
 */
export const refreshToken = () => {
  // Nếu đang refresh → trả về cùng Promise
  if (refreshPromise) {
    return refreshPromise;
  }

  // Tạo Promise mới
  refreshPromise = (async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: { "X-Portal": PORTAL },
        }
      );
      setAccessToken(data.accessToken);
      return data.accessToken;
    } finally {
      refreshPromise = null;   // Reset sau khi xong
    }
  })();

  return refreshPromise;
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh") ||
      originalRequest?.url?.includes("/auth/logout");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        // ✅ Dùng chung hàm refreshToken
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        clearAccessToken();

        if (!window.location.pathname.includes("/auth/sign-in")) {
          window.location.href = "/auth/sign-in";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
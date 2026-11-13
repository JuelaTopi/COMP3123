import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const isAuthRequest = config.url?.startsWith("/user/");

  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.config?.headers?.Authorization
    ) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("session-expired"));
    }

    return Promise.reject(error);
  }
);

export function getErrorMessage(error) {
  if (!error.response) {
    return "Cannot reach the server. Check your connection and try again.";
  }

  const { status, data } = error.response;

  if (status === 429) {
    return "Too many attempts. Please wait and try again later.";
  }

  if (status >= 500) {
    return "The server could not complete your request. Please try again.";
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((item) => item.message).join(" ");
  }

  return data?.message || "Something went wrong. Please try again.";
}

export default api;
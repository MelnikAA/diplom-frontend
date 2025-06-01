import axios from "axios";

export const API_URL = import.meta.env.VITE_BACK_ADDRESS;

const $apiWithHeaders = axios.create({
    baseURL: API_URL,
});

$apiWithHeaders.interceptors.request.use(
  (config) => {

      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

export default $apiWithHeaders;

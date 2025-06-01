import axios from "axios";

const getBaseUrl = () => {
  const search = window.location.search.substring(1); // Убираем "?"
  const decodedSearch = decodeURIComponent(search); // Декодируем %-последовательности
  const urlParams = new URLSearchParams(decodedSearch); // Парсим нормально
  const botUrl = urlParams.get("botUrl");
  return botUrl || import.meta.env.VITE_BACK_ADDRESS;
};
const $api = axios.create({
  baseURL: getBaseUrl(),
});
$api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default $api;

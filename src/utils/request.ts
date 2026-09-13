import axios from "axios";
import type {AxiosInstance, AxiosResponse } from "axios"
import { API_BASE } from "../config/api";

export const instance: AxiosInstance = axios.create({
  timeout: 5000,
  baseURL: API_BASE,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    const response = error?.response;
    if (response) {
      console.error(`请求错误，状态码：${response.status}`);
    }
    return Promise.reject(error);
  },
);


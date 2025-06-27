// 요청/응답 인터셉터

import { AxiosInstance } from "axios";
import { errorHandler } from "./errorHandler";

export const setupInterceptors = (axiosInstance: AxiosInstance) => {
  // 요청
  axiosInstance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답, errorHandler
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => errorHandler(error)
  );
};

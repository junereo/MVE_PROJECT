// src/lib/axiosClient.ts
import axios from "axios";
import Cookies from "js-cookie";

const getTokenFromCookiesSomehow = () => Cookies.get("access_token");

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACK_API_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
    const token = getTokenFromCookiesSomehow();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default axiosClient;
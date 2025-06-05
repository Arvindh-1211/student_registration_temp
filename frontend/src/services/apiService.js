import axios from "axios";

import { store } from "../store/store";

const server = {
    // HOST: '192.168.137.137',
    HOST: process.env.REACT_APP_API_HOST || 'localhost:800',
}

const apiInstance = axios.create({
    baseURL: `${server.HOST}/api`,
});

apiInstance.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiInstance;
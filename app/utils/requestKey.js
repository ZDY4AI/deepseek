import axios from 'axios';
import { message } from 'antd';

const service = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL_ALIAS,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    timeout: 100000,
});

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 检查是否有token参数传入
        if (config.token) {
            config.headers['Authorization'] = `Bearer ${config.token}`;
        }
        return config;
    },
    (error) => {
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }
        message.error('请求错误，请稍后再试');
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.log(error, '请求失败');
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        if (error.code == 'ECONNABORTED') {
            message.error('请求超时，请稍后再试')
        }
        if (axios.isCancel(error)) {
            window.location.href = '/login';
            return;
        }
        return Promise.reject(error);
    }
);

export default service;
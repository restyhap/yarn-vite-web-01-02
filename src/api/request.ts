import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';

// 创建请求实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    if (res.code === 200) {
      return res.data;
    }
    message.error(res.message || '请求失败');
    return Promise.reject(new Error(res.message || '请求失败'));
  },
  (error) => {
    message.error(error.message || '请求失败');
    return Promise.reject(error);
  }
);

export default instance; 
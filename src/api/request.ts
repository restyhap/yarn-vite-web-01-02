/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-18 10:06:24
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-13 20:43:39
 * @FilePath: /yarn-vite-web-01-02/src/utils/request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import type { ResultVo } from './interface';

// 创建 axios 实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080", // 从环境变量获取 API URL
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 在这里可以添加 token 等认证信息
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`
    // }
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    const res = response.data as ResultVo;

    // 这里可以根据后端的响应结构进行调整
    if (res.code === '200') {
      return response;
    }

    // 处理其他状态码
    ElMessage.error(res.message || '请求失败');
    return Promise.reject(new Error(res.message || '请求失败'));
  },
  (error) => {
    console.error('响应错误:', error);
    ElMessage.error(error.message || '请求失败');
    return Promise.reject(error);
  }
);

// 创建请求方法
const request = {
  get<T = ResultVo>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.get(url, config).then(res => res.data as any) as Promise<T>;
  },
  post<T = ResultVo>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.post(url, data, config).then(res => res.data as any) as Promise<T>;
  },
  put<T = ResultVo>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.put(url, data, config).then(res => res.data as any) as Promise<T>;
  },
  delete<T = ResultVo>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.delete(url, config).then(res => res.data as any) as Promise<T>;
  }
};

// 导出请求方法
export default request; 
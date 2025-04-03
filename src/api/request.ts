/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-18 10:06:24
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-04-01 17:54:51
 * @FilePath: /yarn-vite-web-01-02/src/utils/request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import type { ResultVo } from './interface';

// 创建 axios 实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // 关闭withCredentials，避免跨域问题
  withCredentials: false
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 添加调试日志
    console.log('请求配置:', {
      url: config.url,
      baseURL: config.baseURL,
      method: config.method,
      headers: config.headers
    });
    
    // 在这里添加 token 等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
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
    const res = response.data;
    // 添加调试日志
    console.log('响应数据:', res);
    
    // 如果响应不成功，统一处理错误
    if (res.code !== '200') {
      ElMessage.error(res.message || '请求失败');
      // 如果是未认证，跳转到登录页
      if (res.code === '401') {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/';
      }
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    return res.data;
  },
  (error) => {
    // 详细的错误信息处理
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('响应错误:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        config: error.config
      });
      
      // 401 未授权
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/';
      }
    } else if (error.request) {
      // 请求发出去了但没有收到响应
      console.error('请求错误:', {
        request: error.request,
        message: error.message,
        config: error.config
      });
    } else {
      // 请求配置出错
      console.error('配置错误:', error.message);
    }
    
    // 根据错误类型显示不同的错误信息
    if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请检查网络连接');
    } else if (!error.response) {
      ElMessage.error('无法连接到服务器，请检查网络');
    } else {
      ElMessage.error(error.response.data?.message || error.message || '请求失败');
    }
    
    return Promise.reject(error);
  }
);

// 创建请求方法
const request = {
  get<T = ResultVo>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.get(url, config) as Promise<T>;
  },
  post<T = ResultVo>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.post(url, data, config) as Promise<T>;
  },
  put<T = ResultVo>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.put(url, data, config) as Promise<T>;
  },
  delete<T = ResultVo>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.delete(url, config) as Promise<T>;
  }
};

// 导出请求方法
export default request; 
import request from './request';
export * from './generated';
export { request };

// 导出常用的请求方法
export const http = {
  get: <T = any>(url: string, params?: any) => request.get<T>(url, { params }),
  post: <T = any>(url: string, data?: any) => request.post<T>(url, data),
  put: <T = any>(url: string, data?: any) => request.put<T>(url, data),
  delete: <T = any>(url: string, params?: any) => request.delete<T>(url, { params }),
}; 
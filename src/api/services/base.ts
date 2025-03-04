/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:26
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:12:39
 * @FilePath: /yarn-vite-web-01-02/src/api/services/base.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '../request';
import type { ResultVO } from '../generated';

export class BaseApiService {
  protected async get<T>(url: string, params?: any): Promise<T> {
    const response = await request.get<ResultVO>(url, { params });
    return response.data as T;
  }

  protected async post<T>(url: string, data?: any): Promise<T> {
    const response = await request.post<ResultVO>(url, data);
    return response.data as T;
  }

  protected async put<T>(url: string, data?: any): Promise<T> {
    const response = await request.put<ResultVO>(url, data);
    return response.data as T;
  }

  protected async delete<T>(url: string): Promise<T> {
    const response = await request.delete<ResultVO>(url);
    return response.data as T;
  }
}
/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:01:48
 * @FilePath: /yarn-vite-web-01-02/src/api/services/back-inner-components.ts
 * @Description: 椅背内部组件服务类
 */
import { BaseApiService } from './base';
import type { BackInnerComponents, PageBackInnerComponents } from '../generated';

export class BackInnerComponentsService extends BaseApiService {
  /**
   * 创建椅背内部组件
   */
  async createBackInnerComponents(backInnerComponents: Omit<BackInnerComponents, 'id'>): Promise<string> {
    return this.post('/backInnerComponents/save', backInnerComponents);
  }

  /**
   * 更新椅背内部组件信息
   */
  async updateBackInnerComponents(backInnerComponents: Partial<BackInnerComponents> & { id: string }): Promise<BackInnerComponents> {
    return this.put('/backInnerComponents/update', backInnerComponents);
  }

  /**
   * 删除椅背内部组件
   */
  async deleteBackInnerComponents(id: string): Promise<void> {
    return this.delete(`/backInnerComponents/remove/${id}`);
  }

  /**
   * 获取椅背内部组件列表
   */
  async getBackInnerComponentsList(params: {
    productId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PageBackInnerComponents> {
    return this.get('/backInnerComponents/list', params);
  }

  /**
   * 获取椅背内部组件详情
   */
  async getBackInnerComponentsDetail(id: string): Promise<BackInnerComponents> {
    return this.get(`/backInnerComponents/${id}`);
  }
}

// 导出单例实例
export const backInnerComponentsService = new BackInnerComponentsService();
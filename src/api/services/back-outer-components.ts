/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:01:48
 * @FilePath: /yarn-vite-web-01-02/src/api/services/back-outer-components.ts
 * @Description: 椅背外部组件服务类
 */
import { BaseApiService } from './base';
import type { BackOuterComponents, PageBackOuterComponents } from '../generated';

export class BackOuterComponentsService extends BaseApiService {
  /**
   * 创建椅背外部组件
   */
  async createBackOuterComponents(backOuterComponents: Omit<BackOuterComponents, 'id'>): Promise<string> {
    return this.post('/backOuterComponents/save', backOuterComponents);
  }

  /**
   * 更新椅背外部组件信息
   */
  async updateBackOuterComponents(backOuterComponents: Partial<BackOuterComponents> & { id: string }): Promise<BackOuterComponents> {
    return this.put('/backOuterComponents/update', backOuterComponents);
  }

  /**
   * 删除椅背外部组件
   */
  async deleteBackOuterComponents(id: string): Promise<void> {
    return this.delete(`/backOuterComponents/remove/${id}`);
  }

  /**
   * 获取椅背外部组件列表
   */
  async getBackOuterComponentsList(params: {
    productId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PageBackOuterComponents> {
    return this.get('/backOuterComponents/list', params);
  }

  /**
   * 获取椅背外部组件详情
   */
  async getBackOuterComponentsDetail(id: string): Promise<BackOuterComponents> {
    return this.get(`/backOuterComponents/${id}`);
  }
}

// 导出单例实例
export const backOuterComponentsService = new BackOuterComponentsService();
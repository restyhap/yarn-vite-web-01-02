/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:01:48
 * @FilePath: /yarn-vite-web-01-02/src/api/services/arms.ts
 * @Description: 扶手服务类
 */
import { BaseApiService } from './base';
import type { Arms, PageArms } from '../generated';

export class ArmsService extends BaseApiService {
  /**
   * 创建扶手
   */
  async createArms(arms: Omit<Arms, 'id'>): Promise<string> {
    return this.post('/arms/save', arms);
  }

  /**
   * 更新扶手信息
   */
  async updateArms(arms: Partial<Arms> & { id: string }): Promise<Arms> {
    return this.put('/arms/update', arms);
  }

  /**
   * 删除扶手
   */
  async deleteArms(id: string): Promise<void> {
    return this.delete(`/arms/remove/${id}`);
  }

  /**
   * 获取扶手列表
   */
  async getArmsList(params: {
    productId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PageArms> {
    return this.get('/arms/list', params);
  }

  /**
   * 获取扶手详情
   */
  async getArmsDetail(id: string): Promise<Arms> {
    return this.get(`/arms/${id}`);
  }
}

// 导出单例实例
export const armsService = new ArmsService();
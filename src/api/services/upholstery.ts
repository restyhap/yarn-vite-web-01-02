/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:01:48
 * @FilePath: /yarn-vite-web-01-02/src/api/services/upholstery.ts
 * @Description: 座椅装饰服务类
 */
import { BaseApiService } from './base';
import type { Upholstery, PageUpholstery } from '../generated';

export class UpholsteryService extends BaseApiService {
  /**
   * 创建座椅装饰
   */
  async createUpholstery(upholstery: Omit<Upholstery, 'id'>): Promise<string> {
    return this.post('/upholstery/save', upholstery);
  }

  /**
   * 更新座椅装饰信息
   */
  async updateUpholstery(upholstery: Partial<Upholstery> & { id: string }): Promise<Upholstery> {
    return this.put('/upholstery/update', upholstery);
  }

  /**
   * 删除座椅装饰
   */
  async deleteUpholstery(id: string): Promise<void> {
    return this.delete(`/upholstery/remove/${id}`);
  }

  /**
   * 获取座椅装饰列表
   */
  async getUpholsteryList(params: {
    productId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PageUpholstery> {
    return this.get('/upholstery/list', params);
  }

  /**
   * 获取座椅装饰详情
   */
  async getUpholsteryDetail(id: string): Promise<Upholstery> {
    return this.get(`/upholstery/${id}`);
  }
}

// 导出单例实例
export const upholsteryService = new UpholsteryService();
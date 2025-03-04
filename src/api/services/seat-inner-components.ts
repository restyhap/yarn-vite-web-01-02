/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:01:48
 * @FilePath: /yarn-vite-web-01-02/src/api/services/seat-inner-components.ts
 * @Description: 座椅内部组件服务类
 */
import { BaseApiService } from './base';
import type { SeatInnerComponents, PageSeatInnerComponents } from '../generated';

export class SeatInnerComponentsService extends BaseApiService {
  /**
   * 创建座椅内部组件
   */
  async createSeatInnerComponents(seatInnerComponents: Omit<SeatInnerComponents, 'id'>): Promise<string> {
    return this.post('/seatInnerComponents/save', seatInnerComponents);
  }

  /**
   * 更新座椅内部组件信息
   */
  async updateSeatInnerComponents(seatInnerComponents: Partial<SeatInnerComponents> & { id: string }): Promise<SeatInnerComponents> {
    return this.put('/seatInnerComponents/update', seatInnerComponents);
  }

  /**
   * 删除座椅内部组件
   */
  async deleteSeatInnerComponents(id: string): Promise<void> {
    return this.delete(`/seatInnerComponents/remove/${id}`);
  }

  /**
   * 获取座椅内部组件列表
   */
  async getSeatInnerComponentsList(params: {
    productId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PageSeatInnerComponents> {
    return this.get('/seatInnerComponents/list', params);
  }

  /**
   * 获取座椅内部组件详情
   */
  async getSeatInnerComponentsDetail(id: string): Promise<SeatInnerComponents> {
    return this.get(`/seatInnerComponents/${id}`);
  }
}

// 导出单例实例
export const seatInnerComponentsService = new SeatInnerComponentsService();
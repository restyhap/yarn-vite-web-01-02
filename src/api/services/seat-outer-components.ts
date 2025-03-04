/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:01:48
 * @FilePath: /yarn-vite-web-01-02/src/api/services/seat-outer-components.ts
 * @Description: 座椅外部组件服务类
 */
import { BaseApiService } from './base';
import type { SeatOuterComponents, PageSeatOuterComponents } from '../generated';

export class SeatOuterComponentsService extends BaseApiService {
  /**
   * 创建座椅外部组件
   */
  async createSeatOuterComponents(seatOuterComponents: Omit<SeatOuterComponents, 'id'>): Promise<string> {
    return this.post('/seatOuterComponents/save', seatOuterComponents);
  }

  /**
   * 更新座椅外部组件信息
   */
  async updateSeatOuterComponents(seatOuterComponents: Partial<SeatOuterComponents> & { id: string }): Promise<SeatOuterComponents> {
    return this.put('/seatOuterComponents/update', seatOuterComponents);
  }

  /**
   * 删除座椅外部组件
   */
  async deleteSeatOuterComponents(id: string): Promise<void> {
    return this.delete(`/seatOuterComponents/remove/${id}`);
  }

  /**
   * 获取座椅外部组件列表
   */
  async getSeatOuterComponentsList(params: {
    productId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PageSeatOuterComponents> {
    return this.get('/seatOuterComponents/list', params);
  }

  /**
   * 获取座椅外部组件详情
   */
  async getSeatOuterComponentsDetail(id: string): Promise<SeatOuterComponents> {
    return this.get(`/seatOuterComponents/${id}`);
  }
}

// 导出单例实例
export const seatOuterComponentsService = new SeatOuterComponentsService();
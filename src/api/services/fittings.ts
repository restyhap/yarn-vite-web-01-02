/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:01:48
 * @FilePath: /yarn-vite-web-01-02/src/api/services/fittings.ts
 * @Description: 配件服务类
 */
import { BaseApiService } from './base';
import type { Fittings, PageFittings } from '../generated';

export class FittingsService extends BaseApiService {
  async createFittings(fittings: Omit<Fittings, 'id'>): Promise<string> {
    return this.post('/fittings/save', fittings);
  }

  async updateFittings(fittings: Partial<Fittings> & { id: string }): Promise<Fittings> {
    return this.put('/fittings/update', fittings);
  }

  async deleteFittings(id: string): Promise<void> {
    return this.delete(`/fittings/remove/${id}`);
  }

  async getFittingsList(params: {
    productId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PageFittings> {
    return this.get('/fittings/list', params);
  }

  async getFittingsDetail(id: string): Promise<Fittings> {
    return this.get(`/fittings/${id}`);
  }
}

export const fittingsService = new FittingsService();
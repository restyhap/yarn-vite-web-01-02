/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:01:48
 * @FilePath: /yarn-vite-web-01-02/src/api/services/carton-details.ts
 * @Description: 包装箱详情服务类
 */
import { BaseApiService } from './base';
import type { CartonDetails, PageCartonDetails } from '../generated';

export class CartonDetailsService extends BaseApiService {
  async createCartonDetails(cartonDetails: Omit<CartonDetails, 'id'>): Promise<string> {
    return this.post('/cartonDetails/save', cartonDetails);
  }

  async updateCartonDetails(cartonDetails: Partial<CartonDetails> & { id: string }): Promise<CartonDetails> {
    return this.put('/cartonDetails/update', cartonDetails);
  }

  async deleteCartonDetails(id: string): Promise<void> {
    return this.delete(`/cartonDetails/remove/${id}`);
  }

  async getCartonDetailsList(params: {
    productId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PageCartonDetails> {
    return this.get('/cartonDetails/list', params);
  }

  async getCartonDetailsDetail(id: string): Promise<CartonDetails> {
    return this.get(`/cartonDetails/${id}`);
  }
}

export const cartonDetailsService = new CartonDetailsService();
/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:01:48
 * @FilePath: /yarn-vite-web-01-02/src/api/services/foam-details.ts
 * @Description: 泡沫材质服务类
 */
import { BaseApiService } from './base';
import type { FoamDetails, PageFoamDetails } from '../generated';

export class FoamDetailsService extends BaseApiService {
  async createFoamDetails(foamDetails: Omit<FoamDetails, 'id'>): Promise<string> {
    return this.post('/foamDetails/save', foamDetails);
  }

  async updateFoamDetails(foamDetails: Partial<FoamDetails> & { id: string }): Promise<FoamDetails> {
    return this.put('/foamDetails/update', foamDetails);
  }

  async deleteFoamDetails(id: string): Promise<void> {
    return this.delete(`/foamDetails/remove/${id}`);
  }

  async getFoamDetailsList(params: {
    productId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PageFoamDetails> {
    return this.get('/foamDetails/list', params);
  }

  async getFoamDetailsDetail(id: string): Promise<FoamDetails> {
    return this.get(`/foamDetails/${id}`);
  }
}

export const foamDetailsService = new FoamDetailsService();
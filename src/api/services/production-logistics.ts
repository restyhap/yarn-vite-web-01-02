/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:01:48
 * @FilePath: /yarn-vite-web-01-02/src/api/services/production-logistics.ts
 * @Description: 生产物流服务类
 */
import { BaseApiService } from './base';
import type { ProductionLogistics, PageProductionLogistics } from '../generated';

export class ProductionLogisticsService extends BaseApiService {
  async createProductionLogistics(productionLogistics: Omit<ProductionLogistics, 'id'>): Promise<string> {
    return this.post('/productionLogistics/save', productionLogistics);
  }

  async updateProductionLogistics(productionLogistics: Partial<ProductionLogistics> & { id: string }): Promise<ProductionLogistics> {
    return this.put('/productionLogistics/update', productionLogistics);
  }

  async deleteProductionLogistics(id: string): Promise<void> {
    return this.delete(`/productionLogistics/remove/${id}`);
  }

  async getProductionLogisticsList(params: {
    productId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PageProductionLogistics> {
    return this.get('/productionLogistics/list', params);
  }

  async getProductionLogisticsDetail(id: string): Promise<ProductionLogistics> {
    return this.get(`/productionLogistics/${id}`);
  }
}

export const productionLogisticsService = new ProductionLogisticsService();
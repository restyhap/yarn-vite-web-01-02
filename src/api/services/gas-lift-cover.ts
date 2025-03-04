/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:01:48
 * @FilePath: /yarn-vite-web-01-02/src/api/services/gas-lift-cover.ts
 * @Description: 气压棒罩服务类
 */
import { BaseApiService } from './base';
import type { GasLiftCover, PageGasLiftCover } from '../generated';

export class GasLiftCoverService extends BaseApiService {
  /**
   * 创建气压棒罩
   */
  async createGasLiftCover(gasLiftCover: Omit<GasLiftCover, 'id'>): Promise<string> {
    return this.post('/gasLiftCover/save', gasLiftCover);
  }

  /**
   * 更新气压棒罩信息
   */
  async updateGasLiftCover(gasLiftCover: Partial<GasLiftCover> & { id: string }): Promise<GasLiftCover> {
    return this.put('/gasLiftCover/update', gasLiftCover);
  }

  /**
   * 删除气压棒罩
   */
  async deleteGasLiftCover(id: string): Promise<void> {
    return this.delete(`/gasLiftCover/remove/${id}`);
  }

  /**
   * 获取气压棒罩列表
   */
  async getGasLiftCoverList(params: {
    productId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PageGasLiftCover> {
    return this.get('/gasLiftCover/list', params);
  }

  /**
   * 获取气压棒罩详情
   */
  async getGasLiftCoverDetail(id: string): Promise<GasLiftCover> {
    return this.get(`/gasLiftCover/${id}`);
  }
}

// 导出单例实例
export const gasLiftCoverService = new GasLiftCoverService();
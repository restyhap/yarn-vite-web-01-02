/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:01:48
 * @FilePath: /yarn-vite-web-01-02/src/api/services/gas-lift.ts
 * @Description: 气压棒服务类
 */
import { BaseApiService } from './base';
import type { GasLift, PageGasLift } from '../generated';

export class GasLiftService extends BaseApiService {
  /**
   * 创建气压棒
   */
  async createGasLift(gasLift: Omit<GasLift, 'id'>): Promise<string> {
    return this.post('/gasLift/save', gasLift);
  }

  /**
   * 更新气压棒信息
   */
  async updateGasLift(gasLift: Partial<GasLift> & { id: string }): Promise<GasLift> {
    return this.put('/gasLift/update', gasLift);
  }

  /**
   * 删除气压棒
   */
  async deleteGasLift(id: string): Promise<void> {
    return this.delete(`/gasLift/remove/${id}`);
  }

  /**
   * 获取气压棒列表
   */
  async getGasLiftList(params: {
    productId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PageGasLift> {
    return this.get('/gasLift/list', params);
  }

  /**
   * 获取气压棒详情
   */
  async getGasLiftDetail(id: string): Promise<GasLift> {
    return this.get(`/gasLift/${id}`);
  }
}

// 导出单例实例
export const gasLiftService = new GasLiftService();
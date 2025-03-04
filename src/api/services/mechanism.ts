/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 20:53:49
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 22:01:48
 * @FilePath: /yarn-vite-web-01-02/src/api/services/mechanism.ts
 * @Description: 机械结构服务类
 */
import { BaseApiService } from './base';
import type { Mechanism, PageMechanism } from '../generated';

export class MechanismService extends BaseApiService {
  /**
   * 创建机构
   */
   /**
   * 创建机械结构
   */
  async createMechanism(mechanism: Omit<Mechanism, 'id'>): Promise<string> {
    return this.post('/mechanism/save', mechanism);
  }

  /**
   * 更新机构信息
   */
   /**
   * 更新机械结构信息
   */
  async updateMechanism(mechanism: Partial<Mechanism> & { id: string }): Promise<Mechanism> {
    return this.put('/mechanism/update', mechanism);
  }

  /**
   * 删除机构
   */
   /**
   * 删除机械结构
   */
  async deleteMechanism(id: string): Promise<void> {
    return this.delete(`/mechanism/remove/${id}`);
  }

  /**
   * 获取机构列表
   */
   /**
   * 获取机械结构列表
   */
  async getMechanismList(params: {
    productId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PageMechanism> {
    return this.get('/mechanism/list', params);
  }

  /**
   * 获取机构详情
   */
   /**
   * 获取机械结构详情
   */
  async getMechanismDetail(id: string): Promise<Mechanism> {
    return this.get(`/mechanism/${id}`);
  }
}

// 导出单例实例
export const mechanismService = new MechanismService();
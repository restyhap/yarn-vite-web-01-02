/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 23:39:22
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 23:56:34
 * @FilePath: /yarn-vite-web-01-02/src/api/services/bases.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BaseApiService } from './base';
import type { Bases, ResultVO } from '../generated';

export class BasesService extends BaseApiService {
  /**
   * 创建基座记录
   * @param base 基座数据
   */
  async createBase(base: Bases): Promise<string> {
    return this.post('/bases/save', base);
  }

  /**
   * 获取基座列表
   * @param params 查询参数
   */
  async getBaseList(params: {
    keyword?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<{
    records: Bases[];
    totalRow: number;
    pageNumber: number;
    pageSize: number;
  }> {
    return this.get('/bases/list', params);
  }

  /**
   * 获取基座详情
   * @param id 基座ID
   */
  async getBaseDetail(id: string): Promise<Bases> {
    return this.get(`/bases/${id}`);
  }

  /**
   * 更新基座信息
   * @param base 基座数据
   */
  async updateBase(base: Bases): Promise<void> {
    return this.put('/bases/update', base);
  }

  /**
   * 删除基座
   * @param id 基座ID
   */
  async deleteBase(id: string): Promise<void> {
    return this.delete(`/bases/remove/${id}`);
  }
}

// 导出单例实例
export const basesService = new BasesService();
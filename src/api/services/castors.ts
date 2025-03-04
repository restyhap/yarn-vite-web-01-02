/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-04 23:39:39
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 23:51:56
 * @FilePath: /yarn-vite-web-01-02/src/api/services/castors.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BaseApiService } from './base';
import type { Castors,  ResultVO } from '../generated';

export class CastorsService extends BaseApiService {
  /**
   * 创建脚轮记录
   * @param castor 脚轮数据
   */
  async createCastor(castor: Castors): Promise<string> {
    return this.post('/castors/save', castor);
  }

  /**
   * 获取脚轮列表
   * @param params 查询参数
   */
  async getCastorList(params: {
    keyword?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<{
    records: Castors[];
    totalRow: number;
    pageNumber: number;
    pageSize: number;
  }> {
    return this.get('/castors/list', params);
  }

  /**
   * 获取脚轮详情
   * @param id 脚轮ID
   */
  async getCastorDetail(id: string): Promise<Castors> {
    return this.get(`/castors/${id}`);
  }

  /**
   * 更新脚轮信息
   * @param castor 脚轮数据
   */
  async updateCastor(castor: Castors): Promise<void> {
    return this.put('/castors/update', castor);
  }

  /**
   * 删除脚轮
   * @param id 脚轮ID
   */
  async deleteCastor(id: string): Promise<void> {
    return this.delete(`/castors/remove/${id}`);
  }
}

// 导出单例实例
export const castorsService = new CastorsService();
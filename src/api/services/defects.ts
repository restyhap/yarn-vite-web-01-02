import { BaseApiService } from './base';
import type { Defects, DefectsDTO, ResultVO } from '../generated';

export class DefectsService extends BaseApiService {
  /**
   * 创建缺陷记录
   * @param defect 缺陷数据
   */
  async createDefect(defect: DefectsDTO): Promise<string> {
    return this.post('/defects/save', defect);
  }

  /**
   * 获取缺陷列表
   * @param params 查询参数
   */
  async getDefectList(params: {
    keyword?: string;
    qcReportId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<{
    records: Defects[];
    totalRow: number;
    pageNumber: number;
    pageSize: number;
  }> {
    return this.get('/defects/list', params);
  }

  /**
   * 获取缺陷详情
   * @param id 缺陷ID
   */
  async getDefectDetail(id: string): Promise<DefectsDTO> {
    return this.get(`/defects/${id}`);
  }

  /**
   * 更新缺陷信息
   * @param defect 缺陷数据
   */
  async updateDefect(defect: DefectsDTO): Promise<void> {
    return this.put('/defects/update', defect);
  }

  /**
   * 删除缺陷
   * @param id 缺陷ID
   */
  async deleteDefect(id: string): Promise<void> {
    return this.delete(`/defects/remove/${id}`);
  }
}

// 导出单例实例
export const defectsService = new DefectsService();
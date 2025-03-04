import { BaseApiService } from './base';
import type { QcReports, QcReportsDTO, ResultVO } from '../generated';

export class QcReportService extends BaseApiService {
  /**
   * 保存QC报告
   * @param data QC报告数据
   */
  async saveQcReport(data: QcReportsDTO): Promise<string> {
    return this.post('/qcReports/save', data);
  }

  /**
   * 获取QC报告列表
   * @param params 查询参数
   */
  async getQcReportList(params: {
    keyword?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<{
    records: QcReports[];
    totalRow: number;
    pageNumber: number;
    pageSize: number;
  }> {
    return this.get('/qcReports/list', params);
  }

  /**
   * 获取QC报告详情
   * @param id 报告ID
   */
  async getQcReportDetail(id: string): Promise<QcReportsDTO> {
    return this.get(`/qcReports/${id}`);
  }

  /**
   * 更新QC报告
   * @param data QC报告数据
   */
  async updateQcReport(data: QcReportsDTO): Promise<void> {
    return this.put('/qcReports/update', data);
  }

  /**
   * 删除QC报告
   * @param id 报告ID
   */
  async deleteQcReport(id: string): Promise<void> {
    return this.delete(`/qcReports/remove/${id}`);
  }
}

// 导出单例实例
export const qcReportService = new QcReportService();
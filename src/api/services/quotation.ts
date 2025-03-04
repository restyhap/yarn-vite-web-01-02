import { BaseApiService } from './base';
import type { Quotation, ResultVO } from '../generated';

export class QuotationService extends BaseApiService {
  /**
   * 创建报价单
   * @param quotation 报价单数据
   */
  async createQuotation(quotation: Quotation): Promise<string> {
    return this.post('/quotation/save', quotation);
  }

  /**
   * 获取报价单列表
   * @param params 查询参数
   */
  async getQuotationList(params: {
    keyword?: string;
    supplier?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<{
    records: Quotation[];
    totalRow: number;
    pageNumber: number;
    pageSize: number;
  }> {
    return this.get('/quotation/list', params);
  }

  /**
   * 获取报价单详情
   * @param id 报价单ID
   */
  async getQuotationDetail(id: string): Promise<Quotation> {
    return this.get(`/quotation/${id}`);
  }

  /**
   * 更新报价单信息
   * @param quotation 报价单数据
   */
  async updateQuotation(quotation: Quotation): Promise<void> {
    return this.put('/quotation/update', quotation);
  }

  /**
   * 删除报价单
   * @param id 报价单ID
   */
  async deleteQuotation(id: string): Promise<void> {
    return this.delete(`/quotation/remove/${id}`);
  }
}

// 导出单例实例
export const quotationService = new QuotationService();
import { BaseApiService } from './base';
import type { ProductDTO, Products, ResultVO } from '../generated';

export class ProductService extends BaseApiService {
  /**
   * 创建产品
   * @param product 产品数据
   */
  async createProduct(product: ProductDTO): Promise<string> {
    return this.post('/products/save', product);
  }

  /**
   * 获取产品列表
   * @param params 查询参数
   */
  async getProductList(params: {
    keyword?: string;
    supplier?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<{
    records: Products[];
    totalRow: number;
    pageNumber: number;
    pageSize: number;
  }> {
    return this.get('/products/list', params);
  }

  /**
   * 获取产品详情
   * @param id 产品ID
   */
  async getProductDetail(id: string): Promise<ProductDTO> {
    return this.get(`/products/${id}`);
  }

  /**
   * 更新产品信息
   * @param product 产品数据
   */
  async updateProduct(product: ProductDTO): Promise<void> {
    return this.put('/products/update', product);
  }

  /**
   * 删除产品
   * @param id 产品ID
   */
  async deleteProduct(id: string): Promise<void> {
    return this.delete(`/products/remove/${id}`);
  }
}

// 导出单例实例
export const productService = new ProductService();
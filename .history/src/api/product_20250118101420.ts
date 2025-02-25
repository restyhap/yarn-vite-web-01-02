import request from '@/utils/request'

interface ProductResponse {
  code: number
  data: any
  message?: string
}

/**
 * 获取产品详情
 * @param id 产品ID
 */
export function getProductDetail(id: number) {
  return request<ProductResponse>({
    url: `/api/product/${id}`,
    method: 'get'
  })
} 
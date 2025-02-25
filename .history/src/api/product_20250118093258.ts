import request from '@/utils/request'

/**
 * 获取产品详情
 * @param id 产品ID
 */
export function getProductDetail(id: number) {
  return request({
    url: `/api/product/${id}`,
    method: 'get'
  })
} 
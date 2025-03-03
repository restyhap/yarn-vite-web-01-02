/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-02-19 13:18:01
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-02-19 14:51:24
 * @Description: 报价单相关接口
 */
import http from '../axios'

/**
 * 搜索报价单
 * @param {Object} params - 搜索参数
 * @returns {Promise}
 */
export const searchQuotation = (params) => {
  return http.get('/quotation/search', { params })
}

/**
 * 获取报价单列表
 * @returns {Promise}
 */
export const getQuotationList = () => {
  return http.get('/quotation/list')
}

/**
 * 分页获取报价单列表
 * @param {Object} params - 分页参数
 * @returns {Promise}
 */
export const getQuotationPage = (params) => {
  return http.get('/quotation/page', { params })
}

/**
 * 获取报价单详情
 * @param {string|number} id - 报价单ID
 * @returns {Promise}
 */
export const getQuotationDetail = (id) => {
  return http.get(`/quotation/getInfo/${id}`)
}

/**
 * 添加/保存报价单
 * @param {Object} data - 报价单数据
 * @returns {Promise}
 */
export const saveQuotation = (data) => {
  return http.post('/quotation/save', data)
}

/**
 * 更新报价单
 * @param {Object} data - 报价单数据
 * @returns {Promise}
 */
export const updateQuotation = (data) => {
  return http.put('/quotation/update', data)
}

/**
 * 删除报价单
 * @param {string|number} id - 报价单ID
 * @returns {Promise}
 */
export const deleteQuotation = (id) => {
  return http.delete(`/quotation/remove/${id}`)
}

// 导出报价单
export const exportQuotation = (id) => {
  return http.get(`/quotation/${id}/export`, {
    responseType: 'blob'
  })
}

// 获取报价单产品配置
export const getQuotationProducts = (quotationId) => {
  return http.get(`/quotation/${quotationId}/products`)
}

// 更新报价单产品配置
export const updateQuotationProducts = (quotationId, data) => {
  return http.put(`/quotation/${quotationId}/products`, data)
} 
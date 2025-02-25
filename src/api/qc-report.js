/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-02-11 13:25:01
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-02-12 15:30:13
 * @Description: QC报告相关接口
 */
import http from '../axios'

/**
 * 搜索QC报告
 * @param {Object} params - 搜索参数
 * @returns {Promise}
 */
export const searchQcReport = (params) => {
  return http.get('/qc-report/search', { params })
}

/**
 * 获取QC报告列表
 * @returns {Promise}
 */
export const getQcReportList = () => {
  return http.get('/qc-report/list')
}

/**
 * 分页获取QC报告列表
 * @param {Object} params - 分页参数
 * @returns {Promise}
 */
export const getQcReportPage = (params) => {
  return http.get('/qc-report/page', { params })
}

/**
 * 获取QC报告详情
 * @param {string|number} id - QC报告ID
 * @returns {Promise}
 */
export const getQcReportDetail = (id) => {
  return http.get(`/qc-report/getInfo/${id}`)
}

/**
 * 添加QC报告
 * @param {Object} data - QC报告数据
 * @returns {Promise}
 */
export const addQcReport = (data) => {
  return http.post('/qc-report/save', data)
}

/**
 * 更新QC报告
 * @param {Object} data - QC报告数据
 * @returns {Promise}
 */
export const updateQcReport = (data) => {
  return http.put('/qc-report/update', data)
}

/**
 * 删除QC报告
 * @param {string|number} id - QC报告ID
 * @returns {Promise}
 */
export const deleteQcReport = (id) => {
  return http.delete(`/qc-report/remove/${id}`)
}

// 上传质检报告图片
export const uploadQCImages = (data) => {
  return http.post('/qcReports/upload-images', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取质检缺陷列表
export const getDefectList = (reportId) => {
  return http.get(`/qc-report/${reportId}/defects`)
}

// 添加质检缺陷
export const addDefect = (reportId, data) => {
  return http.post(`/qc-report/${reportId}/defects`, data)
} 
/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-02-11 13:18:01
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-02-18 14:51:24
 * @Description: 规格相关接口
 */
import http from '../axios'

/**
 * 搜索规格
 * @param {Object} params - 搜索参数
 * @returns {Promise}
 */
export const searchSpecification = (params) => {
  return http.get('/qcReports/search', { params })
}

/**
 * 获取规格列表
 * @returns {Promise}
 */
export const getSpecificationList = () => {
  return http.get('/qcReports/list')
}

/**
 * 分页获取规格列表
 * @param {Object} params - 分页参数
 * @returns {Promise}
 */
export const getSpecificationPage = (params) => {
  return http.get('/qcReports/page', { params })
}

/**
 * 获取规格详情
 * @param {string|number} id - 规格ID
 * @returns {Promise}
 */
export const getSpecificationDetail = (id) => {
  return http.get(`/qcReports/getInfo/${id}`)
}

/**
 * 添加规格
 * @param {Object} data - 规格数据
 * @returns {Promise}
 */
export const addSpecification = (data) => {
  return http.post('/qcReports/save', data)
}

/**
 * 更新规格
 * @param {Object} data - 规格数据
 * @returns {Promise}
 */
export const updateSpecification = (data) => {
  return http.put('/qcReports/update', data)
}

/**
 * 更新缺陷
 * @param {Object} data - 缺陷数据
 * @returns {Promise}
 */
export const updateDefects = (data) => {
  return http.put('/defects/update', data)
}

/**
 * 删除缺陷
 * @param {string|number} id - 缺陷ID
 * @returns {Promise}
 */
export const deleteDefects = (id) => {
  return http.delete(`/defects/remove/${id}`)
}


/**
 * 删除规格
 * @param {string|number} id - 规格ID
 * @returns {Promise}
 */
export const deleteSpecification = (id) => {
  return http.delete(`/qcReports/remove/${id}`)
} 

/**
 * 根据报告ID获取缺陷信息
 * @param {*} id 
 * @returns 
 */
export const getInfoByReportId = (id) =>{
  return http.get(`/defects/getInfoByReportId/${id}`)
}

/**
 * 根据报告ID获取缺陷图片
 * @param {*} id 
 * @returns 
 */
export const getDefectsImagesByDefectIdId = (id) =>{
  return http.get(`/defectImages/search?defectId=${id}`)
}
/**
 * 保存质检报告
 * @param {*} data 
 * @returns 
 */
export const saveQcReportsDTO = (data) =>{
  return http.post('/qcReportsDto/save', data)
}

/**
 * 根据ID获取质检报告DTO
 * @param {string|number} id - 质检报告ID
 * @returns {Promise}
 */
export const getQcReportsDtoById = (id) =>{
  return http.get(`/qcReportsDto/get/${id}`)
}


/**
 * 保存缺陷
 * @param {Object} data - 缺陷数据
 * @returns {Promise}
 */
export const saveDefects = (data) =>{
  return http.post('/defects/save', data)
}

/**
 * 删除缺陷图片
 * @param {string|number} id - 缺陷图片ID
 * @returns {Promise}
 */
export const removeDefectImages = (id) =>{
  return http.delete(`/defectImages/remove/${id}`)
}

/**
 * 保存缺陷图片
 * @param {Object} data - 缺陷图片数据
 * @returns {Promise}
 */
export const saveDefectImages = (data) =>{
  return http.post('/defectImages/save', data);
}
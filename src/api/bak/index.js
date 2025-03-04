/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-02-11 15:40:01
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-04 20:07:49
 * @Description: API接口统一导出
 */

import http from '@/axios/index'

export * from './specification'
export * from './qc-report'
export * from './quotation' 

export const upload = (formData) => {
    return http.post('/files/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const removeFile = (filePath) =>{
    return http.get(`/files/remove?filePath=${filePath}`)
}
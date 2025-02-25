/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-02-16 17:56:19
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-02-19 12:21:28
 * @FilePath: /yarn-vite-web-01-02/src/api/specification.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'
import type { QcReportsDTO } from '@/types/qcReport'

export function saveQcReportsDTO(data: QcReportsDTO) {
  return request({
    url: '/qcReports/save',
    method: 'post',
    data
  }).then(res => {
    // 统一处理响应数据
    if (res.data) {
      return res.data
    }
    return res
  })
} 
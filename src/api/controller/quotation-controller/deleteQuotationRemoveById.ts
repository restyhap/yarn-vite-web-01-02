/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-12 10:48:50
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-13 08:39:36
 * @FilePath: /yarn-vite-web-01-02/src/api/controller/quotation-controller/deleteQuotationRemoveById.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /quotation/remove/{id}
 */
export function deleteQuotationRemoveById(params: DeleteQuotationRemoveByIdParams, config?: AxiosRequestConfig) {
    return request.delete<DeepRequired<ResultVo>>(`/quotation/remove/${params.id}`, config);
}

export interface DeleteQuotationRemoveByIdParams {
    id: string;
}

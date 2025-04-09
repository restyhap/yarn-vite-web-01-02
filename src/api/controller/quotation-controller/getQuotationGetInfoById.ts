/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-03-12 10:48:47
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-04-08 07:35:36
 * @FilePath: /yarn-vite-web-01-02/src/api/controller/quotation-controller/getQuotationGetInfoById.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from "@/api/request";
import { type ResultVo, type Quotation } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /quotation/get/{id}
 */
export function getQuotationGetInfoById(params: GetQuotationGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<ResultVo<Quotation>>(`/quotation/getInfo/${params.id}`, config);
}

export interface GetQuotationGetInfoByIdParams {
    id: string;
}

import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /quotation/getInfo/{id}
 */
export function getQuotationGetInfoById(params: GetQuotationGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/quotation/getInfo/${params.id}`, config);
}

export interface GetQuotationGetInfoByIdParams {
    id: string;
}

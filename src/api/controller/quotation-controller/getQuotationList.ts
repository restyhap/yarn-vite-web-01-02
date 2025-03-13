import request from "@/api/request";
import { type ResultVo, type DeepRequired } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /quotation/list
 */
export function getQuotationList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<ResultVo>>(`/quotation/list`, config);
}
